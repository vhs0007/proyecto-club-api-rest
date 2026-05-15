import { Injectable } from '@nestjs/common';
import { CreateScheduledActivityDto } from './dto/request/create-scheduled_activity.dto';
import { UpdateScheduledActivityDto } from './dto/request/update-scheduled_activity.dto';

@Injectable()
export class ScheduledActivitiesService {
  create(createScheduledActivityDto: CreateScheduledActivityDto) {
    return 'This action adds a new scheduledActivity';
  }

  findAll() {
    return `This action returns all scheduledActivities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduledActivity`;
  }

  update(id: number, updateScheduledActivityDto: UpdateScheduledActivityDto) {
    return `This action updates a #${id} scheduledActivity`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduledActivity`;
  }
}
