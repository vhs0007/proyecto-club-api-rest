import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MembershipTypeService } from './membership_type.service';
import { MembershipTypeController } from './membership_type.controller';
import { MembershipTypeRepository } from './repository/membership_type.repository.impl';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';

@Module({
  imports: [AuthModule, CommonModule],
  controllers: [MembershipTypeController],
  providers: [MembershipTypeService, MembershipTypeRepository],
})
export class MembershipTypeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(MembershipTypeController);
  }
}
