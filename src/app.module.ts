import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { MembershipModule } from './membership/membership.module';
import { PrismaModule } from './prisma/prisma.module';
import { MembershipTypeModule } from './membership_type/membership_type.module';
import { UserTypeModule } from './user_type/user_type.module';
import { ReportsModule } from './reports/reports.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { FacilityWorkersModule } from './facility_workers/facility_workers.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ActivitiesModule,
    FacilitiesModule,
    MembershipModule,
    MembershipTypeModule,
    UserTypeModule,
    ReportsModule,
    TimeEntriesModule,
    FacilityWorkersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
