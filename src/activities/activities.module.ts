import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { ActivitiesRepository } from './repository/activities.repository.impl';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';

@Module({
  imports: [PrismaModule, AuthModule, CommonModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivitiesRepository],
})
export class ActivitiesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(ActivitiesController);
  }
}
