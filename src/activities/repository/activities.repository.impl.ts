import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IActivitiesRepository, ActivityResponse, UserNavigation, FacilityNavigation } from './activitities.repository';
import { CreateActivityDto } from '../dto/request/create-activities.dto';
import { UpdateActivityDto } from '../dto/request/update-activities.dto';

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
};

type ActivityWithRelations = {
  id: number;
  name: string;
  type: string;
  startAt: Date;
  endAt: Date;
  userId: number;
  cost: unknown;
  facilityId: number;
  isActive: boolean;
  user: UserFromPrisma;
  facility: FacilityFromPrisma;
};

@Injectable()
export class ActivitiesRepository implements IActivitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private userPrismaToInterface(user: UserFromPrisma): UserNavigation {
    return {
      id: user.id,
      name: user.name,
      typeId: user.typeId,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      isActive: user.isActive,
    };
  }

  private facilityPrismaToInterface(facility: FacilityFromPrisma): FacilityNavigation {
    return {
      id: facility.id,
      name: facility.type,
      address: '',
      city: '',
      state: '',
    };
  }

  private mapRow(row: ActivityWithRelations): ActivityResponse {
    const cost = typeof row.cost === 'object' && row.cost !== null && 'toNumber' in row.cost
      ? (row.cost as { toNumber(): number }).toNumber()
      : Number(row.cost);
    const response: ActivityResponse = {
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
    return response;
  }

  async create(createActivityDto: CreateActivityDto): Promise<ActivityResponse> {
    const { facilityId, isActive, ...rest } = createActivityDto;
    const created = await this.prisma.activity.create({
      data: {
        ...rest,
        facilityId,
        isActive: isActive ?? true,
      },
      include: { facility: true, user: true } as { facility: true },
    });
    return this.mapRow(created as ActivityWithRelations);
  }

  async findAll(): Promise<ActivityResponse[]> {
    const list = await this.prisma.activity.findMany({
      include: { facility: true, user: true } as { facility: true },
    });
    return list.map((row) => this.mapRow(row as ActivityWithRelations));
  }

  async findById(id: number): Promise<ActivityResponse | null> {
    const row = await this.prisma.activity.findUnique({
      where: { id },
      include: { facility: true, user: true } as { facility: true },
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
      include: { facility: true, user: true } as { facility: true },
    });
    return this.mapRow(updated as ActivityWithRelations);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.activity.delete({ where: { id } });
  }
}
