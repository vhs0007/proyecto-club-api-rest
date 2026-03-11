import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { MembershipModule } from './membership/membership.module';
import { ExpirationModule } from './expiration/expiration.module';
import { PrismaModule } from './prisma/prisma.module';
import { MembershipTypeModule } from './membership_type/membership_type.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ActivitiesModule,
    FacilitiesModule,
    MembershipModule,
    ExpirationModule,
    MembershipTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerMiddleware],
})
export class AppModule {}