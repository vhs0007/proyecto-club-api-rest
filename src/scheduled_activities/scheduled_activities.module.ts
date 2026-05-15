import { Module } from '@nestjs/common';
import { ScheduledActivitiesService } from './scheduled_activities.service';
import { ScheduledActivitiesController } from './scheduled_activities.controller';

@Module({
  controllers: [ScheduledActivitiesController],
  providers: [ScheduledActivitiesService],
})
export class ScheduledActivitiesModule {}
