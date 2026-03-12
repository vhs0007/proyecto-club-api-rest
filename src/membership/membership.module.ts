import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { MembershipRepository } from './repository/membership.repository.impl';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';

@Module({
  imports: [PrismaModule, AuthModule, CommonModule],
  controllers: [MembershipController],
  providers: [MembershipService, MembershipRepository],
})
export class MembershipModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(MembershipController);
  }
}
