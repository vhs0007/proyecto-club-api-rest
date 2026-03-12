import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesRepository } from './repository/facilities.repository.impl';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';

@Module({
  imports: [PrismaModule, AuthModule, CommonModule],
  controllers: [FacilitiesController],
  providers: [FacilitiesService, FacilitiesRepository],
})
export class FacilitiesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(FacilitiesController);
  }
}

