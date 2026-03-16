import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { IFacilitiesRepository, FacilityResponse, MembershipTypeNavigation } from './facilities.repository';
import { CreateFacilityDto } from '../dto/request/create-facility.dto';
import { UpdateFacilityDto } from '../dto/request/update-facility.dto';
import type { WorkerNavigation, UserTypeNavigation, UserNavigation, ActivitiesNavigation } from './facilities.repository';

type FacilityCreateResult = Prisma.facilitiesGetPayload<{
  include: {
    responsibleWorkerUser: { include: { type: true } };
    assistantWorkerUser: { include: { type: true } };
    activities: { include: { user: { include: { type: true } } } };
    facilities_membership: { include: { type: true } };
  };
}>;

type UserTypeFromPrisma = {
  id: number;
  name: string;
};
type WorkerFromPrisma = {
  id: number;
  name: string;
  type: UserTypeFromPrisma;
  typeId: number;
  email: string | null;
  password: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
};
type UserFromPrisma = {
  id: number;
  name: string;
  type: UserTypeFromPrisma;
  typeId: number;
  email: string | null;
  password: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
};

type ActivityFromPrisma = {
  id: number;
  name: string;
  type: string;
  startAt: Date;
  endAt: Date;
  userId: number;
  user: UserFromPrisma;
  cost: number;
  isActive: boolean;
};

type MembershipTypeFromPrisma = {
  id: number;
  name: string;
  price: Prisma.Decimal;
};

type FacilityMembershipFromPrisma = {
  id: number;
  facilityId: number;
  membershipTypeId: number;
  type: MembershipTypeFromPrisma;
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

  private workerPrismaToInterface(worker: WorkerFromPrisma): WorkerNavigation {
    return {
      id: worker.id,
      name: worker.name,
      type: worker.type,
      email: worker.email,
      password: worker.password,
      createdAt: worker.createdAt,
      deletedAt: worker.deletedAt,
      isActive: worker.isActive,
    };
  }
  private userPrismaToInterface(user: UserFromPrisma): UserNavigation {
    return {
      id: user.id,
      name: user.name,
      type: user.type,
      email: user.email,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      isActive: user.isActive,
    };
  }
  private activityPrismaToInterface(activity: FacilityCreateResult['activities'][number]): ActivitiesNavigation {
    return {
      id: activity.id,
      name: activity.name,
      type: activity.type,
      startAt: activity.startAt,
      endAt: activity.endAt,
      user: this.userPrismaToInterface(activity.user),
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

  private mapRow(row: FacilityCreateResult): FacilityResponse {
    return {
      id: row.id,
      type: row.type,
      capacity: row.capacity,
      responsibleWorker: row.responsibleWorkerUser ? this.workerPrismaToInterface(row.responsibleWorkerUser) : this.stubWorker(row.responsibleWorker),
      assistantWorker: row.assistantWorkerUser ? this.workerPrismaToInterface(row.assistantWorkerUser) : row.assistantWorker != null ? this.stubWorker(row.assistantWorker) : null,
      isActive: row.isActive,
      activities: row.activities ? row.activities.map((activity) => this.activityPrismaToInterface(activity)) : [],
      membershipTypes: row.facilities_membership?.map((fm) => this.membershipTypePrismaToInterface(fm.type)) ?? [],
    };
  }

  async create(createFacilityDto: CreateFacilityDto): Promise<FacilityResponse> {
    const { responsibleWorker, assistantWorker, membershipTypeIds, id: _id, ...rest } = createFacilityDto;
    const created = await this.prisma.facilities.create({
      data: {
        ...rest,
        responsibleWorker,
        assistantWorker,
        isActive: createFacilityDto.isActive ?? true,
      },
      include: FACILITY_INCLUDE as { responsibleWorkerUser: { include: { type: true } }, assistantWorkerUser: { include: { type: true } }, activities: { include: { user: { include: { type: true } } } }, facilities_membership: { include: { type: true } } },
    });
    if (membershipTypeIds.length > 0) {
      await this.prisma.facilities_membership.createMany({
        data: membershipTypeIds.map((membershipTypeId) => ({
          facilityId: created.id,
          membershipTypeId,
        })),
      });
    }
    const withMembershipTypes = await this.findById(created.id);
    return withMembershipTypes ?? this.mapRow(created);
  }
  
  async findAll(): Promise<FacilityResponse[]> {
    const list = await this.prisma.facilities.findMany({
      include: FACILITY_INCLUDE as { responsibleWorkerUser: { include: { type: true } }, assistantWorkerUser: { include: { type: true } }, activities: { include: { user: { include: { type: true } } } }, facilities_membership: { include: { type: true } } },
    });
    return list.map((row) => this.mapRow(row));
  }

  async findById(id: number): Promise<FacilityResponse | null> {
    const row = await this.prisma.facilities.findUnique({
      where: { id },
      include: FACILITY_INCLUDE as { responsibleWorkerUser: { include: { type: true } }, assistantWorkerUser: { include: { type: true } }, activities: { include: { user: { include: { type: true } } } }, facilities_membership: { include: { type: true } } },
    });
    return row ? this.mapRow(row) : null;
  }


  async update(id: number, updateFacilityDto: UpdateFacilityDto): Promise<FacilityResponse> {
    const data: Record<string, unknown> = {};
    if (updateFacilityDto.type !== undefined) data.type = updateFacilityDto.type;
    if (updateFacilityDto.capacity !== undefined) data.capacity = updateFacilityDto.capacity;
    if (updateFacilityDto.responsibleWorker !== undefined) data.responsibleWorker = updateFacilityDto.responsibleWorker;
    if (updateFacilityDto.assistantWorker !== undefined) data.assistantWorker = updateFacilityDto.assistantWorker;
    if (updateFacilityDto.isActive !== undefined) data.isActive = updateFacilityDto.isActive;
    const updated = await this.prisma.facilities.update({
      where: { id },
      data,
      include: FACILITY_INCLUDE as { responsibleWorkerUser: { include: { type: true } }, assistantWorkerUser: { include: { type: true } }, activities: { include: { user: { include: { type: true } } } }, facilities_membership: { include: { type: true } } },
    });
    return this.mapRow(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.activity.deleteMany({
      where: { facilityId: id },
    });
    await this.prisma.facilities_membership.deleteMany({
      where: { facilityId: id },
    });
    await this.prisma.facilities.delete({ where: { id } });
  }
}
