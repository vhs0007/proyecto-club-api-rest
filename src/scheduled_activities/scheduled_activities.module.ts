import { Module } from '@nestjs/common';
import { ScheduledActivitiesService } from './scheduled_activities.service';
import { ScheduledActivitiesController } from './scheduled_activities.controller';
import { ScheduledActivitiesRepositoryImpl } from './repository/scheduled_activities.repository.impl';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ScheduledActivitiesController],
  providers: [ScheduledActivitiesService, ScheduledActivitiesRepositoryImpl],
})
export class ScheduledActivitiesModule {}
