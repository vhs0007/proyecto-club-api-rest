import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateScheduledActivityDto } from './dto/request/create-scheduled_activity.dto';
import { UpdateScheduledActivityDto } from './dto/request/update-scheduled_activity.dto';
import { ScheduledActivitiesRepositoryImpl } from './repository/scheduled_activities.repository.impl';
import { QueryScheduledActivityDto } from './dto/request/query-scheduled_activity.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScheduledActivitiesService {
  constructor(
    private readonly scheduledActivitiesRepository: ScheduledActivitiesRepositoryImpl,
    private readonly prisma: PrismaService,
  ) {}

  async create(createScheduledActivityDto: CreateScheduledActivityDto) {
    const existing = await this.prisma.datetime_scheduled_activities.findFirst({
      where: {
        clubId: createScheduledActivityDto.clubId,
        scheduled_activities: {
          facilityId: createScheduledActivityDto.facilityId,
        },
        OR: createScheduledActivityDto.datetimeScheduledActivities.map((slot) => ({
          hourStart: slot.hourStart,
          hourEnd: slot.hourEnd,
          workingDayId: slot.workingDayId,
        })),
      },
    });
    if (existing) {
      throw new BadRequestException(
        'Ya existe una actividad programada para esta instalación en el mismo día y horario',
      );
    }
    return this.scheduledActivitiesRepository.create(createScheduledActivityDto);
  }

  findWorkingDays(clubId: number) {
    return this.prisma.working_days.findMany({
      where: { clubId },
      orderBy: { id: 'asc' },
    });
  }

  findAll(clubId: number) {
    try {
      return this.scheduledActivitiesRepository.findAll(clubId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findOne(query: QueryScheduledActivityDto) {
    try {
      return this.scheduledActivitiesRepository.findById(query);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  update(
    query: QueryScheduledActivityDto,
    updateScheduledActivityDto: UpdateScheduledActivityDto,
  ) {
    try {
      return this.scheduledActivitiesRepository.update(
        query,
        updateScheduledActivityDto,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  remove(query: QueryScheduledActivityDto) {
    try {
      return this.scheduledActivitiesRepository.delete(query);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
