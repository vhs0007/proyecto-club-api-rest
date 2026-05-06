import { Injectable, NotFoundException } from '@nestjs/common';
import { numerator, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { IFacilitiesRepository, MembershipTypeNavigation, UserNavigation } from './facilities.repository';
import { CreateFacilityDto } from '../dto/request/create-facility.dto';
import { UpdateFacilityDto } from '../dto/request/update-facility.dto';
import type { ActivitiesNavigation } from './facilities.repository';
import { QueryFacilitiesRequestDto } from '../dto/request/query-facilities.request.dto';
import { FacilityResponseDto } from '../dto/response/facility-response.dto';

/**
 * Shape mínimo que leemos de Prisma cuando usamos `FACILITY_INCLUDE`.
 * No es el payload completo del cliente (Prisma devuelve más columnas); solo lo que usa este repo.
 */

interface UserTypeRow {
  id: number;
  name: string;
}

/** `users` con relación `type` incluida (responsable, asistentes o instructor de actividad). */
interface UserWithTypeRow {
  id: number;
  name: string;
  email: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
  type: UserTypeRow;
}

interface FacilityWorkerLinkRow {
  id: number;
  user: UserWithTypeRow;
}

interface ActivityWithUserRow {
  id: number;
  name: string;
  type: string;
  date: Date;
  hourStart: string;
  hourEnd: string;
  cost: Prisma.Decimal;
  isActive: boolean;
  user: UserWithTypeRow;
}

type MembershipTypeFromPrisma = {
  id: number;
  name: string;
  price: Prisma.Decimal;
};

interface FacilitiesMembershipLinkRow {
  type: MembershipTypeFromPrisma;
}

interface FacilityQueryRow {
  id: number;
  type: string;
  capacity: number;
  isActive: boolean;
  ResponsibleWorkerUserId: number;
  /** Responsable (`facilities.user`); puede ser null si la relación no resolvió. */
  user: UserWithTypeRow | null;
  facility_workers: FacilityWorkerLinkRow[];
  activities: ActivityWithUserRow[];
  facilities_membership: FacilitiesMembershipLinkRow[];
}

type FacilityWorkerNavigation = {
  id: number;
  user: UserNavigation;
};

const FACILITY_INCLUDE = {
  user: {
    include: {
      type: true,
    },
  },
  facility_workers: {
    include: {
      user: {
        include: {
          type: true,
        },
      },
    },
  },
  activities: {
    include: {
      user: {
        include: {
          type: true,
        },
      },
    },
  },
  facilities_membership: {
    include: {
      type: true,
    },
  },
} as const;

@Injectable()
export class FacilitiesRepository implements IFacilitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private userToNav(user: UserWithTypeRow): UserNavigation {
    return {
      id: user.id,
      name: user.name,
      type: { id: user.type.id, name: user.type.name },
      email: user.email,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      isActive: user.isActive,
    };
  }

  private activityPrismaToInterface(activity: ActivityWithUserRow): ActivitiesNavigation {
    return {
      id: activity.id,
      name: activity.name,
      type: activity.type,
      date: activity.date,
      hourStart: activity.hourStart,
      hourEnd: activity.hourEnd,
      user: this.userToNav(activity.user),
      cost: Number(activity.cost),
      isActive: activity.isActive,
    };
  }

  private membershipTypePrismaToInterface(membershipType: MembershipTypeFromPrisma): MembershipTypeNavigation {
    return {
      id: membershipType.id,
      name: membershipType.name,
      price: Number(membershipType.price),
    };
  }

  private mapRow(row: FacilityQueryRow): FacilityResponseDto {
    const workers: FacilityWorkerNavigation[] = row.facility_workers.map((fw) => ({
      id: fw.id,
      user: this.userToNav(fw.user),
    }));

    const assistantsList = workers
      .filter((w) => w.user.id !== row.ResponsibleWorkerUserId)
      .map((w) => w.user);

    return {
      id: row.id,
      type: row.type,
      capacity: row.capacity,
      responsibleWorker: row.user ? this.userToNav(row.user) : null,
      assistantWorkers: assistantsList.length > 0 ? assistantsList : null,
      isActive: row.isActive,
      activities: row.activities.map((activity) => this.activityPrismaToInterface(activity)),
      membershipTypes: row.facilities_membership.map((fm) => this.membershipTypePrismaToInterface(fm.type)),
    };
  }

  async create(createFacilityDto: CreateFacilityDto): Promise<FacilityResponseDto> {
    const { responsibleWorker, assistantWorker, membershipTypeIds, id: _id, clubId, type, capacity } = createFacilityDto;

    const responsibleUser = await this.prisma.users.findFirst({
      where: { id: responsibleWorker, clubId },
    });
    if (!responsibleUser) {
      throw new NotFoundException(`Responsible worker ${responsibleWorker} not found`);
    }

    const numerator = await this.generateNumerator(clubId);
    const id = numerator.value;

    const created = await this.prisma.facilities.create({
      data: {
        id,
        type,
        capacity,
        isActive: createFacilityDto.isActive ?? true,
        clubId,
        ResponsibleWorkerUserId: responsibleUser.id,
        ResponsibleWorkerTypeId: responsibleUser.typeId,
      },
      include: FACILITY_INCLUDE,
    });

    if (assistantWorker != null) {
      const assistantUser = await this.prisma.users.findFirst({
        where: { id: assistantWorker, clubId },
      });
      if (!assistantUser) {
        throw new NotFoundException(`Assistant worker ${assistantWorker} not found`);
      }
      await this.prisma.facility_workers.create({
        data: {
          facilityId: created.id,
          clubId,
          userId: assistantUser.id,
          userTypeId: assistantUser.typeId,
        },
      });
    }

    if (membershipTypeIds.length > 0) {
      await this.prisma.facilities_membership.createMany({
        data: membershipTypeIds.map((membershipTypeId) => ({
          facilityId: created.id,
          membershipTypeId,
          clubId,
        })),
      });
    }

    const refreshed = await this.findById({ id: created.id, clubId });
    if (!refreshed) throw new NotFoundException(`Facility ${created.id} not found after create`);
    return refreshed;
  }

  private async generateNumerator(clubId: number): Promise<numerator> {
    const existNumerator = await this.prisma.numerator.findFirst({ where: { name: 'facilityId', clubId } });
    if (existNumerator) {
      return await this.prisma.numerator.update({
        where: { id: existNumerator.id },
        data: { value: existNumerator.value + 1 },
      });
    }
    const numerator = await this.prisma.numerator.create({
      data: {
        name: 'facilityId',
        clubId,
        value: 1,
      },
    });
    return numerator;
  }

  async findAll(clubId: number): Promise<FacilityResponseDto[]> {
    const list = await this.prisma.facilities.findMany({
      where: { clubId },
      include: FACILITY_INCLUDE,
    });
    return list.map((row) => this.mapRow(row));
  }

  async findById(query: QueryFacilitiesRequestDto): Promise<FacilityResponseDto | null> {
    const row = await this.prisma.facilities.findUnique({
      where: { id_clubId: { id: query.id, clubId: query.clubId } },
      include: FACILITY_INCLUDE,
    });
    return row ? this.mapRow(row) : null;
  }

  async update(query: QueryFacilitiesRequestDto, updateFacilityDto: UpdateFacilityDto): Promise<FacilityResponseDto> {
    if (updateFacilityDto.responsibleWorker !== undefined) {
      const user = await this.prisma.users.findFirst({
        where: { id: updateFacilityDto.responsibleWorker, clubId: query.clubId },
      });
      if (!user) {
        throw new NotFoundException(`Responsible worker ${updateFacilityDto.responsibleWorker} not found`);
      }
      await this.prisma.facilities.update({
        where: { id_clubId: { id: query.id, clubId: query.clubId } },
        data: {
          ResponsibleWorkerUserId: user.id,
          ResponsibleWorkerTypeId: user.typeId,
        },
      });
    }

    if (updateFacilityDto.assistantWorker !== undefined) {
      await this.prisma.facility_workers.deleteMany({
        where: { facilityId: query.id, clubId: query.clubId },
      });
      if (updateFacilityDto.assistantWorker != null) {
        const assistant = await this.prisma.users.findFirst({
          where: { id: updateFacilityDto.assistantWorker, clubId: query.clubId },
        });
        if (!assistant) {
          throw new NotFoundException(`Assistant worker ${updateFacilityDto.assistantWorker} not found`);
        }
        await this.prisma.facility_workers.create({
          data: {
            facilityId: query.id,
            clubId: query.clubId,
            userId: assistant.id,
            userTypeId: assistant.typeId,
          },
        });
      }
    }

    const scalarData: Prisma.facilitiesUncheckedUpdateInput = {};
    if (updateFacilityDto.type !== undefined) scalarData.type = updateFacilityDto.type;
    if (updateFacilityDto.capacity !== undefined) scalarData.capacity = updateFacilityDto.capacity;
    if (updateFacilityDto.isActive !== undefined) scalarData.isActive = updateFacilityDto.isActive;

    if (updateFacilityDto.membershipTypeIds !== undefined) {
      await this.prisma.facilities_membership.deleteMany({
        where: { facilityId: query.id, clubId: query.clubId },
      });
      if (updateFacilityDto.membershipTypeIds.length > 0) {
        await this.prisma.facilities_membership.createMany({
          data: updateFacilityDto.membershipTypeIds.map((membershipTypeId) => ({
            facilityId: query.id,
            membershipTypeId,
            clubId: query.clubId,
          })),
        });
      }
    }

    if (Object.keys(scalarData).length > 0) {
      await this.prisma.facilities.update({
        where: { id_clubId: { id: query.id, clubId: query.clubId } },
        data: scalarData,
      });
    }

    const refreshed = await this.findById(query);
    if (!refreshed) throw new NotFoundException(`Facility ${query.id} not found after update`);
    return refreshed;
  }

  async delete(query: QueryFacilitiesRequestDto): Promise<void> {
    await this.prisma.activity.deleteMany({
      where: { facilityId: query.id, clubId: query.clubId },
    });
    await this.prisma.facility_workers.deleteMany({
      where: { facilityId: query.id, clubId: query.clubId },
    });
    await this.prisma.facilities_membership.deleteMany({
      where: { facilityId: query.id, clubId: query.clubId },
    });
    await this.prisma.facilities.delete({ where: { id_clubId: { id: query.id, clubId: query.clubId } } });
  }
}
