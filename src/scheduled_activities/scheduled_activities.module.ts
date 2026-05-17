import { Module } from '@nestjs/common';
import { ScheduledActivitiesService } from './scheduled_activities.service';
import { ScheduledActivitiesController } from './scheduled_activities.controller';
import { ScheduledActivitiesRepositoryImpl } from './repository/scheduled_activities.repository.impl';

@Module({
  controllers: [ScheduledActivitiesController],
  providers: [ScheduledActivitiesService, ScheduledActivitiesRepositoryImpl],
})
export class ScheduledActivitiesModule {}
