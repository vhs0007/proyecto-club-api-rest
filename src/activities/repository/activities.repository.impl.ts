import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IActivitiesRepository, ActivityResponse, UserNavigation, FacilityNavigation } from './activitities.repository';
import { CreateActivityDto } from '../dto/request/create-activities.dto';
import { UpdateActivityDto } from '../dto/request/update-activities.dto';
import { Prisma } from '@prisma/client';

type UserFromPrisma = {
  id: number;
  name: string;
  typeId: number;
  email: string | null;
  password: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
};

type FacilityFromPrisma = {
  id: number;
  type: string;
  capacity: number;
  responsibleWorker: number;
  assistantWorker: number | null;
  isActive: boolean;
  responsibleWorkerUser: UserFromPrisma | null;
  assistantWorkerUser: UserFromPrisma | null;
};

type ActivityWithRelations = {
  id: number;
  name: string;
  type: string;
  startAt: Date;
  endAt: Date;
  userId: number;
  cost: Prisma.Decimal;
  facilityId: number;
  isActive: boolean;
  user: UserFromPrisma;
  facility: FacilityFromPrisma;
};

const ACTIVITY_INCLUDE = {
  user: true,
  facility: {
    include: {
      responsibleWorkerUser: true,
      assistantWorkerUser: true,
    },
  },
} as const;

@Injectable()
export class ActivitiesRepository implements IActivitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private userPrismaToInterface(user: UserFromPrisma): UserNavigation {
    return {
      id: user.id,
      name: user.name,
      typeId: user.typeId,
      email: user.email,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      isActive: user.isActive,
    };
  }

  private facilityPrismaToInterface(facility: FacilityFromPrisma): FacilityNavigation {
    const stubUser = (id: number): UserNavigation => ({
      id,
      name: '',
      typeId: 0,
      email: null,
      createdAt: new Date(0),
      deletedAt: null,
      isActive: true,
    });
    return {
      id: facility.id,
      name: facility.type,
      capacity: facility.capacity,
      responsibleWorker: facility.responsibleWorkerUser
        ? this.userPrismaToInterface(facility.responsibleWorkerUser)
        : stubUser(facility.responsibleWorker),
      assistantWorker:
        facility.assistantWorkerUser && facility.assistantWorker != null
          ? this.userPrismaToInterface(facility.assistantWorkerUser)
          : facility.assistantWorker != null
            ? stubUser(facility.assistantWorker)
            : null,
      isActive: facility.isActive,
    };
  }

  private mapRow(row: ActivityWithRelations): ActivityResponse {
    const cost = row.cost.toNumber();
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      startAt: row.startAt,
      endAt: row.endAt,
      user: this.userPrismaToInterface(row.user),
      cost,
      facility: this.facilityPrismaToInterface(row.facility),
      isActive: row.isActive,
    };
  }

  async create(createActivityDto: CreateActivityDto): Promise<ActivityResponse> {
    const { facilityId, isActive, ...rest } = createActivityDto;
    const created = await this.prisma.activity.create({
      data: {
        ...rest,
        facilityId,
        isActive: isActive ?? true,
      },
      include: ACTIVITY_INCLUDE as { user: true; facility: { include: { responsibleWorkerUser: true; assistantWorkerUser: true } } },
    });
    return this.mapRow(created as ActivityWithRelations);
  }

  async findAll(): Promise<ActivityResponse[]> {
    const list = await this.prisma.activity.findMany({
      include: ACTIVITY_INCLUDE as { user: true; facility: { include: { responsibleWorkerUser: true; assistantWorkerUser: true } } },
    });
    return list.map((row) => this.mapRow(row as ActivityWithRelations));
  }

  async findById(id: number): Promise<ActivityResponse | null> {
    const row = await this.prisma.activity.findUnique({
      where: { id },
      include: ACTIVITY_INCLUDE as { user: true; facility: { include: { responsibleWorkerUser: true; assistantWorkerUser: true } } },
    });
    return row ? this.mapRow(row as ActivityWithRelations) : null;
  }

  async update(id: number, updateActivityDto: UpdateActivityDto): Promise<ActivityResponse> {
    const data: Record<string, unknown> = {};
    if (updateActivityDto.name !== undefined) data.name = updateActivityDto.name;
    if (updateActivityDto.type !== undefined) data.type = updateActivityDto.type;
    if (updateActivityDto.startAt !== undefined) data.startAt = updateActivityDto.startAt;
    if (updateActivityDto.endAt !== undefined) data.endAt = updateActivityDto.endAt;
    if (updateActivityDto.userId !== undefined) data.userId = updateActivityDto.userId;
    if (updateActivityDto.cost !== undefined) data.cost = updateActivityDto.cost;
    if (updateActivityDto.facilityId !== undefined) data.facilityId = updateActivityDto.facilityId;
    if (updateActivityDto.isActive !== undefined) data.isActive = updateActivityDto.isActive;
    const updated = await this.prisma.activity.update({
      where: { id },
      data,
      include: ACTIVITY_INCLUDE as { user: true; facility: { include: { responsibleWorkerUser: true; assistantWorkerUser: true } } },
    });
    return this.mapRow(updated as ActivityWithRelations);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.activity.delete({ where: { id } });
  }
}
