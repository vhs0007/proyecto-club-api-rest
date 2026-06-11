import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateScheduledActivityDto } from './dto/request/create-scheduled_activity.dto';
import { UpdateScheduledActivityDto } from './dto/request/update-scheduled_activity.dto';
import { ScheduledActivitiesRepositoryImpl } from './repository/scheduled_activities.repository.impl';
import { QueryScheduledActivityDto } from './dto/request/query-scheduled_activity.dto';

@Injectable()
export class ScheduledActivitiesService {
  constructor(
    private readonly scheduledActivitiesRepository: ScheduledActivitiesRepositoryImpl,
  ) {}

  create(createScheduledActivityDto: CreateScheduledActivityDto) {
    return this.scheduledActivitiesRepository.create(createScheduledActivityDto);
  }

  findWorkingDays(clubId: number) {
    return this.scheduledActivitiesRepository.findWorkingDays(clubId);
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
