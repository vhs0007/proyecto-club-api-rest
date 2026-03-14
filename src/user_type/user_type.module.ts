import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserTypeService } from './user_type.service';
import { UserTypeController } from './user_type.controller';
import { UserTypeRepository } from './repository/user_type.repository.impl';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';

@Module({
  imports: [AuthModule, CommonModule],
  controllers: [UserTypeController],
  providers: [UserTypeService, UserTypeRepository],
})
export class UserTypeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UserTypeController);
  }
}
