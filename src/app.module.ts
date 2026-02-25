import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { MembershipModule } from './membership/membership.module';

@Module({
  imports: [AuthModule, UsersModule, ActivitiesModule, FacilitiesModule, MembershipModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
