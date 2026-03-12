import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ExpirationService } from './expiration.service';
import { ExpirationController } from './expiration.controller';
import { ExpirationRepository } from './repository/expiration.repository.impl';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';

@Module({
  imports: [PrismaModule, AuthModule, CommonModule],
  controllers: [ExpirationController],
  providers: [ExpirationService, ExpirationRepository],
})
export class ExpirationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(ExpirationController);
  }
}
