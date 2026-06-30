import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  FacilityNavigation,
  MembershipTypeNavigation,
  UserNavigation,
} from '../../facilities/repository/facilities.repository';
import type { IActivitiesRepository } from './activitities.repository';
import { CreateActivityDto } from '../dto/request/create-activities.dto';
import { UpdateActivityDto } from '../dto/request/update-activities.dto';
import { QueryActivitiesRequestDto } from '../dto/request/query-activities.request.dto';
import { numerator } from '@prisma/client';
import { ActivityResponseDto } from '../dto/response/activity-response.dto';

/**
 * Shape mínimo que leemos de Prisma con `ACTIVITY_QUERY_INCLUDE`.
 * Prisma devuelve más columnas; aquí solo lo que usa este repo.
 */

interface UserTypeRow {
  id: number;
  name: string;
}

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

type MembershipTypeFromPrisma = {
  id: number;
  name: string;
  price: Prisma.Decimal;
};

interface FacilitiesMembershipLinkRow {
  type: MembershipTypeFromPrisma;
}

interface FacilityNestedRow {
  id: number;
  type: string;
  capacity: number;
  isActive: boolean;
  ResponsibleWorkerUserId: number;
  user: UserWithTypeRow | null;
  facility_workers: FacilityWorkerLinkRow[];
  facilities_membership: FacilitiesMembershipLinkRow[];
}

interface ActivityQueryRow {
  id: number;
  name: string;
  type: string;
  date: Date;
  hourStart: string;
  hourEnd: string;
  cost: { toNumber(): number };
  state: string;
  clubId: number;
  user: UserWithTypeRow | null;
  facility: FacilityNestedRow;
}

const ACTIVITY_QUERY_INCLUDE = {
  user: {
    include: {
      type: true,
    },
  },
  facility: {
    include: {
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
      facilities_membership: {
        include: {
          type: true,
        },
      },
    },
  },
} as const;

@Injectable()
export class ActivitiesRepository implements IActivitiesRepository {
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

  private membershipTypeToNav(
    membershipType: MembershipTypeFromPrisma,
  ): MembershipTypeNavigation {
    return {
      id: membershipType.id,
      name: membershipType.name,
      price: Number(membershipType.price),
    };
  }

  private mapFacility(facility: FacilityNestedRow): FacilityNavigation {
    const assistants = facility.facility_workers
      .filter((fw) => fw.user.id !== facility.ResponsibleWorkerUserId)
      .map((fw) => this.userToNav(fw.user));

    return {
      id: facility.id,
      type: facility.type,
      capacity: facility.capacity,
      isActive: facility.isActive,
      responsibleWorker: facility.user ? this.userToNav(facility.user) : null,
      assistantWorkers: assistants.length > 0 ? assistants : null,
      membershipTypes: facility.facilities_membership.map((fm) =>
        this.membershipTypeToNav(fm.type),
      ),
    };
  }

  private toMinutes(hour: string): number {
    const [hh, mm] = hour.split(':').map((value) => Number(value));
    return hh * 60 + mm;
  }

  private overlaps(ini: string, fin: string, ini2: string, fin2: string): boolean {
    return this.toMinutes(ini) < this.toMinutes(fin2) && this.toMinutes(ini2) < this.toMinutes(fin);
  }

  private mapRow(row: ActivityQueryRow): ActivityResponseDto {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      hourStart: row.hourStart,
      hourEnd: row.hourEnd,
      date: row.date,
      user: row.user ? this.userToNav(row.user) : null,
      cost: row.cost.toNumber(),
      state: row.state,
      facility: this.mapFacility(row.facility),
      clubId: row.clubId,
    };
  }

  async create(
    createActivityDto: CreateActivityDto,
  ): Promise<ActivityResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: {
        id_clubId_typeId: {
          id: createActivityDto.userId,
          clubId: createActivityDto.clubId,
          typeId: createActivityDto.userTypeId,
        },
      },
    });
    if (!user) throw new BadRequestException('User not found');

    const facility = await this.prisma.facilities.findUnique({
      where: {
        id_clubId: {
          id: createActivityDto.facilityId,
          clubId: createActivityDto.clubId,
        },
      },
    });
    if (!facility) throw new BadRequestException('Facility not found');

    if (
      this.toMinutes(createActivityDto.hourStart) >=
      this.toMinutes(createActivityDto.hourEnd)
    ) {
      throw new BadRequestException('hourStart must be before hourEnd');
    }

    const requestedDate = new Date(createActivityDto.date);
    const dayStart = new Date(
      requestedDate.getFullYear(),
      requestedDate.getMonth(),
      requestedDate.getDate(),
    );
    const nextDayStart = new Date(
      requestedDate.getFullYear(),
      requestedDate.getMonth(),
      requestedDate.getDate() + 1,
    );
    const reservas = await this.prisma.activity.findMany({
      where: {
        clubId: createActivityDto.clubId,
        facilityId: createActivityDto.facilityId,
        date: { gte: dayStart, lt: nextDayStart },
      },
      select: { hourStart: true, hourEnd: true },
    });
    for (const r of reservas) {
      if (
        this.overlaps(
          createActivityDto.hourStart,
          createActivityDto.hourEnd,
          r.hourStart,
          r.hourEnd,
        )
      ) {
        throw new BadRequestException(
          'Ya existe una reserva para esta instalación en la misma fecha con un horario que se superpone',
        );
      }
    }

    const { facilityId, state, ...rest } = createActivityDto;
    const numerator = await this.generateNumerator(createActivityDto.clubId);
    const id = numerator.value;
    const created = await this.prisma.activity.create({
      data: {
        id,
        ...rest,
        facilityId,
        state: state ?? 'PENDIENTE',
        clubId: createActivityDto.clubId,
      },
      include: ACTIVITY_QUERY_INCLUDE,
    });

    return this.mapRow(created);
  }

  private async generateNumerator(clubId: number): Promise<numerator> {
    const existNumerator = await this.prisma.numerator.findFirst({
      where: { name: 'activityId', clubId },
    });
    if (existNumerator) {
      return await this.prisma.numerator.update({
        where: { id: existNumerator.id },
        data: { value: existNumerator.value + 1 },
      });
    }
    const numerator = await this.prisma.numerator.create({
      data: {
        name: 'activityId',
        clubId,
        value: 1,
      },
    });
    return numerator;
  }

  async findAll(clubId: number): Promise<ActivityResponseDto[]> {
    const list = await this.prisma.activity.findMany({
      where: { clubId },
      include: ACTIVITY_QUERY_INCLUDE,
    });
    return list.map((row) => this.mapRow(row));
  }

  async findById(
    query: QueryActivitiesRequestDto,
  ): Promise<ActivityResponseDto | null> {
    const row = await this.prisma.activity.findUnique({
      where: { id_clubId: { id: query.id, clubId: query.clubId } },
      include: ACTIVITY_QUERY_INCLUDE,
    });
    return row ? this.mapRow(row) : null;
  }

  async update(
    query: QueryActivitiesRequestDto,
    updateActivityDto: UpdateActivityDto,
  ): Promise<ActivityResponseDto> {
    const row = await this.findById(query);
    if (!row) throw new NotFoundException('Activity not found');

    if (updateActivityDto.userId !== undefined) {
      const user = await this.prisma.users.findUnique({
        where: {
          id_clubId_typeId: {
            id: updateActivityDto.userId,
            clubId: row.clubId,
            typeId: updateActivityDto.userTypeId,
          },
        },
      });
      if (!user) throw new BadRequestException('User not found');
    }

    if (updateActivityDto.facilityId !== undefined) {
      const facility = await this.prisma.facilities.findUnique({
        where: {
          id_clubId: { id: updateActivityDto.facilityId, clubId: query.clubId },
        },
      });
      if (!facility) throw new BadRequestException('Facility not found');
    }

    const hourStart =
      updateActivityDto.hourStart !== undefined
        ? updateActivityDto.hourStart
        : row.hourStart;
    const hourEnd =
      updateActivityDto.hourEnd !== undefined
        ? updateActivityDto.hourEnd
        : row.hourEnd;
    if (this.toMinutes(hourStart) >= this.toMinutes(hourEnd)) {
      throw new BadRequestException('hourStart must be before hourEnd');
    }

    const facilityId = updateActivityDto.facilityId ?? row.facility.id;
    const date =
      updateActivityDto.date !== undefined
        ? new Date(updateActivityDto.date)
        : new Date(row.date);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nextDayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const reservas = await this.prisma.activity.findMany({
      where: {
        clubId: query.clubId,
        facilityId,
        date: { gte: dayStart, lt: nextDayStart },
        NOT: { id: query.id },
      },
      select: { hourStart: true, hourEnd: true },
    });
    for (const r of reservas) {
      if (this.overlaps(hourStart, hourEnd, r.hourStart, r.hourEnd)) {
        throw new BadRequestException(
          'Ya existe una reserva para esta instalación en la misma fecha con un horario que se superpone',
        );
      }
    }

    const data: Record<string, unknown> = {};
    if (updateActivityDto.name !== undefined)
      data.name = updateActivityDto.name;
    if (updateActivityDto.type !== undefined)
      data.type = updateActivityDto.type;
    if (updateActivityDto.hourStart !== undefined)
      data.hourStart = updateActivityDto.hourStart;
    if (updateActivityDto.hourEnd !== undefined)
      data.hourEnd = updateActivityDto.hourEnd;
    if (updateActivityDto.date !== undefined)
      data.date = updateActivityDto.date;
    if (updateActivityDto.userId !== undefined) {
      data.userId = updateActivityDto.userId;
      data.userTypeId = updateActivityDto.userTypeId;
    }
    if (updateActivityDto.cost !== undefined)
      data.cost = updateActivityDto.cost;
    if (updateActivityDto.facilityId !== undefined)
      data.facilityId = updateActivityDto.facilityId;
    if (updateActivityDto.state !== undefined)
      data.state = updateActivityDto.state;
    const updated = await this.prisma.activity.update({
      where: { id_clubId: { id: query.id, clubId: query.clubId } },
      data,
      include: ACTIVITY_QUERY_INCLUDE,
    });

    return this.mapRow(updated);
  }

  async delete(query: QueryActivitiesRequestDto): Promise<void> {
    await this.prisma.activity.delete({
      where: { id_clubId: { id: query.id, clubId: query.clubId } },
    });
  }
}
