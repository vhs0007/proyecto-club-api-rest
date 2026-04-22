import { Injectable, NotFoundException } from '@nestjs/common';
import { numerator, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { IFacilitiesRepository, MembershipTypeNavigation } from './facilities.repository';
import { CreateFacilityDto } from '../dto/request/create-facility.dto';
import { UpdateFacilityDto } from '../dto/request/update-facility.dto';
import type { WorkerNavigation, UserTypeNavigation, UserNavigation, ActivitiesNavigation } from './facilities.repository';
import { QueryFacilitiesRequestDto } from '../dto/request/query-facilities.request.dto';
import { FacilityResponseDto } from '../dto/response/facility-response.dto';

type FacilityCreateResult = Prisma.facilitiesGetPayload<{
  include: {
    responsibleWorkerUser: { include: { type: true } };
    assistantWorkerUser: { include: { type: true } };
    activities: { include: { user: { include: { type: true } } } };
    facilities_membership: { include: { type: true } };
  };
}>;

type MembershipTypeFromPrisma = {
  id: number;
  name: string;
  price: Prisma.Decimal;
};

const FACILITY_INCLUDE = {
  responsibleWorkerUser: {
    include: {
      type: true,
    },
  },
  assistantWorkerUser: {
    include: {
      type: true,
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

  private activityPrismaToInterface(activity: FacilityCreateResult['activities'][number]): ActivitiesNavigation {
    return {
      id: activity.id,
      name: activity.name,
      type: activity.type,
      date: activity.date,
      hourStart: activity.hourStart,
      hourEnd: activity.hourEnd,
      user: activity.user,
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


  private stubWorker(id: number): WorkerNavigation {
    return {
      id,
      name: '',
      type: { id: 0, name: '' },
      email: null,
      password: null,
      createdAt: new Date(0),
      deletedAt: null,
      isActive: true,
    };
  }

  private mapRow(row: FacilityCreateResult): FacilityResponseDto {
    return {
      id: row.id,
      type: row.type,
      capacity: row.capacity,
      responsibleWorker: row.responsibleWorkerUser ? row.responsibleWorkerUser : this.stubWorker(row.responsibleWorker),
      assistantWorker: row.assistantWorkerUser ? row.assistantWorkerUser : row.assistantWorker != null ? this.stubWorker(row.assistantWorker) : null,
      isActive: row.isActive,
      activities: row.activities ? row.activities.map((activity) => this.activityPrismaToInterface(activity)) : [],
      membershipTypes: row.facilities_membership?.map((fm) => this.membershipTypePrismaToInterface(fm.type)) ?? [],
    };
  }

  async create(createFacilityDto: CreateFacilityDto): Promise<FacilityResponseDto> {
    const { responsibleWorker, assistantWorker, membershipTypeIds, id: _id, ...rest } = createFacilityDto;
    const numerator = await this.generateNumerator(createFacilityDto.clubId);
    const id = numerator.value;
    const created = await this.prisma.facilities.create({
      data: {
        id,
        ...rest,
        responsibleWorkerTypeId: 1,
        responsibleWorker,
        assistantWorker,
        assistantWorkerTypeId: 1,
        isActive: createFacilityDto.isActive ?? true,
        clubId: createFacilityDto.clubId,
      },
      include: FACILITY_INCLUDE as { responsibleWorkerUser: { include: { type: true } }, assistantWorkerUser: { include: { type: true } }, activities: { include: { user: { include: { type: true } } } }, facilities_membership: { include: { type: true } } },
    });
    if (membershipTypeIds.length > 0) {
      await this.prisma.facilities_membership.createMany({
        data: membershipTypeIds.map((membershipTypeId) => ({
          facilityId: created.id,
          membershipTypeId,
          clubId: createFacilityDto.clubId,
        })),
      });
    }
    const withMembershipTypes = await this.findById({id: created.id, clubId: createFacilityDto.clubId});
    return withMembershipTypes ?? this.mapRow(created);
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
      include: FACILITY_INCLUDE as { responsibleWorkerUser: { include: { type: true } }, assistantWorkerUser: { include: { type: true } }, activities: { include: { user: { include: { type: true } } } }, facilities_membership: { include: { type: true } } },
    });
    return list.map((row) => this.mapRow(row));
  }

  async findById(query: QueryFacilitiesRequestDto): Promise<FacilityResponseDto | null> {
    const row = await this.prisma.facilities.findUnique({
      where: { id_clubId: {id: query.id, clubId: query.clubId}},
      include: FACILITY_INCLUDE as { responsibleWorkerUser: { include: { type: true } }, assistantWorkerUser: { include: { type: true } }, activities: { include: { user: { include: { type: true } } } }, facilities_membership: { include: { type: true } } },
    });
    return row ? this.mapRow(row) : null;
  }


  async update(query: QueryFacilitiesRequestDto, updateFacilityDto: UpdateFacilityDto): Promise<FacilityResponseDto> {
    const data: Record<string, unknown> = {};
    if (updateFacilityDto.type !== undefined) data.type = updateFacilityDto.type;
    if (updateFacilityDto.capacity !== undefined) data.capacity = updateFacilityDto.capacity;
    if (updateFacilityDto.responsibleWorker !== undefined) data.responsibleWorker = updateFacilityDto.responsibleWorker;
    if (updateFacilityDto.assistantWorker !== undefined) data.assistantWorker = updateFacilityDto.assistantWorker;
    if (updateFacilityDto.isActive !== undefined) data.isActive = updateFacilityDto.isActive;

    const membershipTypeIds = updateFacilityDto.membershipTypeIds;

    if (membershipTypeIds !== undefined) {
      await this.prisma.facilities_membership.deleteMany({ where: { facilityId: query.id, clubId: query.clubId } });
      if (membershipTypeIds.length > 0) {
        await this.prisma.facilities_membership.createMany({
          data: membershipTypeIds.map(membershipTypeId => ({
            facilityId: query.id,
            membershipTypeId,
            clubId: updateFacilityDto.clubId,
          })),
        });
      }
      if (Object.keys(data).length > 0) {
        await this.prisma.facilities.update({ where: { id_clubId: {id: query.id, clubId: query.clubId}}, data });
      }
      const refreshed = await this.findById(query);
      if (!refreshed) throw new NotFoundException(`Facility ${query.id} not found after update`);
      return refreshed;
    }

    const updated = await this.prisma.facilities.update({
      where: { id_clubId: {id: query.id, clubId: query.clubId}},
      data,
      include: FACILITY_INCLUDE as { responsibleWorkerUser: { include: { type: true } }, assistantWorkerUser: { include: { type: true } }, activities: { include: { user: { include: { type: true } } } }, facilities_membership: { include: { type: true } } },
    });
    return this.mapRow(updated);
  }

  async delete(query: QueryFacilitiesRequestDto): Promise<void> {
    await this.prisma.activity.deleteMany({
      where: { facilityId: query.id, clubId: query.clubId},
    });
    await this.prisma.facilities_membership.deleteMany({
      where: { facilityId: query.id, clubId: query.clubId},
    });
    await this.prisma.facilities.delete({ where: { id_clubId: {id: query.id, clubId: query.clubId} } });
  }
}
