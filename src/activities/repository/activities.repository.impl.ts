import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IActivitiesRepository, ActivityResponse, UserNavigation, FacilityNavigation } from './activitities.repository';
import { CreateActivityDto } from '../dto/request/create-activities.dto';
import { UpdateActivityDto } from '../dto/request/update-activities.dto';
import { Prisma } from '@prisma/client';
import { QueryActivitiesRequestDto } from '../dto/request/query-activities.request.dto';
import { numerator } from '@prisma/client';

type UserFromPrisma = {
  id: number;
  name: string;
  typeId: number;
  email: string | null;
  password: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
  document: string;
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
  hourStart: string;
  hourEnd: string;
  date: Date;
  userId: number;
  cost: Prisma.Decimal;
  facilityId: number;
  isActive: boolean;
  user: UserFromPrisma;
  facility: FacilityFromPrisma;
  clubId: number;
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
      type: facility.type,
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
      hourStart: row.hourStart,
      hourEnd: row.hourEnd,
      date: row.date,
      user: this.userPrismaToInterface(row.user),
      cost,
      facility: this.facilityPrismaToInterface(row.facility),
      isActive: row.isActive,
      clubId: row.clubId,
      document: row.user.document,
    };
  }

  async create(createActivityDto: CreateActivityDto): Promise<ActivityResponse> {
    const { facilityId, isActive, ...rest } = createActivityDto;
    const numerator = await this.generateNumerator(createActivityDto.clubId);
    const id = numerator.value;
    const created = await this.prisma.activity.create({
      data: {
        id,
        ...rest,
        facilityId,
        isActive: isActive ?? true,
        clubId: createActivityDto.clubId,
      },
      include: ACTIVITY_INCLUDE as { user: true; facility: { include: { responsibleWorkerUser: true; assistantWorkerUser: true } } },
    });
    return this.mapRow(created as ActivityWithRelations);
  }

  private async generateNumerator(clubId: number): Promise<numerator> {
    const existNumerator = await this.prisma.numerator.findFirst({ where: { name: 'activityId', clubId } });
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

  async findAll(clubId: number): Promise<ActivityResponse[]> {
    const list = await this.prisma.activity.findMany({
      where: { clubId },
      include: ACTIVITY_INCLUDE as { user: true; facility: { include: { responsibleWorkerUser: true; assistantWorkerUser: true } } },
    });
    return list.map((row) => this.mapRow(row as ActivityWithRelations));
  }

  async findById(query: QueryActivitiesRequestDto): Promise<ActivityResponse | null> {
    const row = await this.prisma.activity.findUnique({
      where: { id_clubId: {id: query.id, clubId: query.clubId} },
      include: ACTIVITY_INCLUDE as { user: true; facility: { include: { responsibleWorkerUser: true; assistantWorkerUser: true } } },
    });
    return row ? this.mapRow(row as ActivityWithRelations) : null;
  }

  async update(query: QueryActivitiesRequestDto, updateActivityDto: UpdateActivityDto): Promise<ActivityResponse> {
    const data: Record<string, unknown> = {};
    if (updateActivityDto.name !== undefined) data.name = updateActivityDto.name;
    if (updateActivityDto.type !== undefined) data.type = updateActivityDto.type;
    if (updateActivityDto.hourStart !== undefined) data.hourStart = updateActivityDto.hourStart;
    if (updateActivityDto.hourEnd !== undefined) data.hourEnd = updateActivityDto.hourEnd;
    if (updateActivityDto.date !== undefined) data.date = updateActivityDto.date;
    if (updateActivityDto.userId !== undefined) data.userId = updateActivityDto.userId;
    if (updateActivityDto.cost !== undefined) data.cost = updateActivityDto.cost;
    if (updateActivityDto.facilityId !== undefined) data.facilityId = updateActivityDto.facilityId;
    if (updateActivityDto.isActive !== undefined) data.isActive = updateActivityDto.isActive;
    const updated = await this.prisma.activity.update({
      where: { id_clubId: {id: query.id, clubId: query.clubId} },
      data,
      include: ACTIVITY_INCLUDE as { user: true; facility: { include: { responsibleWorkerUser: true; assistantWorkerUser: true } } },
    });
    return this.mapRow(updated as ActivityWithRelations);
  }

  async delete(query: QueryActivitiesRequestDto): Promise<void> {
    await this.prisma.activity.delete({ where: { id_clubId: {id: query.id, clubId: query.clubId} } });
  }
}
