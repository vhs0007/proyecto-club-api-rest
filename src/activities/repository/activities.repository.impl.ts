import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IActivitiesRepository, UserNavigation, FacilityNavigation } from './activitities.repository';
import { CreateActivityDto } from '../dto/request/create-activities.dto';
import { UpdateActivityDto } from '../dto/request/update-activities.dto';
import { Prisma } from '@prisma/client';
import { QueryActivitiesRequestDto } from '../dto/request/query-activities.request.dto';
import { numerator } from '@prisma/client';
import { ActivityResponseDto } from '../dto/response/activity-response.dto';

const ACTIVITY_INCLUDE = {
  user: true,
  facility: {
    include: {
      responsibleWorkerUser: true,
      assistantWorkerUser: true,
    },
  },
} as const;


interface ActivityResult {
  id: number;
  name: string;
  type: string;
  hourStart: string;
  hourEnd: string;
  cost: Prisma.Decimal;
  isActive: boolean;
  facility: FacilityNavigation;
  clubId: number;
  date: Date;
  user: UserNavigation | null;
}

@Injectable()
export class ActivitiesRepository implements IActivitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private activityPrismaToInterface(activity: ActivityResult): ActivityResponseDto {
    return {
      id: activity.id,
      name: activity.name,
      type: activity.type,
      hourStart: activity.hourStart,
      hourEnd: activity.hourEnd,
      date: activity.date,
      user: activity.user,
      cost: activity.cost.toNumber(),
      isActive: activity.isActive,
      facility: activity.facility,
      clubId: activity.clubId,
    }
  };

  async create(createActivityDto: CreateActivityDto): Promise<ActivityResponseDto> {
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

    const facilityResult: FacilityNavigation = {
      id: created.facility.id,
      type: created.facility.type,
      capacity: created.facility.capacity,
      responsibleWorker: created.facility.responsibleWorkerUser,
      assistantWorker: created.facility.assistantWorkerUser,
      isActive: created.facility.isActive,
    };

    const activityResult: ActivityResult = {
      id: created.id,
      name: created.name,
      type: created.type,
      hourStart: created.hourStart,
      hourEnd: created.hourEnd,
      cost: created.cost,
      isActive: created.isActive,
      facility: facilityResult,
      clubId: created.clubId,
      date: created.date,
      user: created.user,
    };

    const activity: ActivityResponseDto = this.activityPrismaToInterface(activityResult);
    return activity;
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

  async findAll(clubId: number): Promise<ActivityResponseDto[]> {
    const list = await this.prisma.activity.findMany({
      where: { clubId },
      include: ACTIVITY_INCLUDE as { user: true; facility: { include: { responsibleWorkerUser: true; assistantWorkerUser: true } } },
    });
    const activityResults: ActivityResult[] = list.map((row): ActivityResult => ({
      id: row.id,
      name: row.name,
      type: row.type,
      hourStart: row.hourStart,
      hourEnd: row.hourEnd,
      cost: row.cost,
      isActive: row.isActive,
      facility: {
        id: row.facility.id,
        type: row.facility.type,
        capacity: row.facility.capacity,
        responsibleWorker: row.facility.responsibleWorkerUser,
        assistantWorker: row.facility.assistantWorkerUser,
        isActive: row.facility.isActive,
      },
      clubId: row.clubId,
      date: row.date,
      user: row.user,
    }));
    const activities: ActivityResponseDto[] = activityResults.map((activityResult) => this.activityPrismaToInterface(activityResult));
    return activities;
  }

  async findById(query: QueryActivitiesRequestDto): Promise<ActivityResponseDto | null> {
    const row = await this.prisma.activity.findUnique({
      where: { id_clubId: {id: query.id, clubId: query.clubId} },
      include: ACTIVITY_INCLUDE as { user: true; facility: { include: { responsibleWorkerUser: true; assistantWorkerUser: true } } },
    });
    if (!row) return null;

    const activityResult: ActivityResult = {
      id: row.id,
      name: row.name,
      type: row.type,
      hourStart: row.hourStart,
      hourEnd: row.hourEnd,
      cost: row.cost,
      isActive: row.isActive,
      facility: {
        id: row.facility.id,
        type: row.facility.type,
        capacity: row.facility.capacity,
        responsibleWorker: row.facility.responsibleWorkerUser,
        assistantWorker: row.facility.assistantWorkerUser,
        isActive: row.facility.isActive,
      },
      clubId: row.clubId,
      date: row.date,
      user: row.user,
    };

    const activity: ActivityResponseDto = this.activityPrismaToInterface(activityResult);
    return activity;
  }

  async update(query: QueryActivitiesRequestDto, updateActivityDto: UpdateActivityDto): Promise<ActivityResponseDto> {
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
    
    const activityResult: ActivityResult = {
      id: updated.id,
      name: updated.name,
      type: updated.type,
      hourStart: updated.hourStart,
      hourEnd: updated.hourEnd,
      cost: updated.cost,
      isActive: updated.isActive,
      facility: {
        id: updated.facility.id,
        type: updated.facility.type,
        capacity: updated.facility.capacity,
        responsibleWorker: updated.facility.responsibleWorkerUser,
        assistantWorker: updated.facility.assistantWorkerUser,
        isActive: updated.facility.isActive,
      },
      clubId: updated.clubId,
      date: updated.date,
      user: updated.user,
    };

    const activity: ActivityResponseDto = this.activityPrismaToInterface(activityResult);
    return activity;
  }

  async delete(query: QueryActivitiesRequestDto): Promise<void> {
    await this.prisma.activity.delete({ where: { id_clubId: {id: query.id, clubId: query.clubId} } });
  }
}
