import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesRepository } from './repository/facilities.repository.impl';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FacilitiesController],
  providers: [FacilitiesService, FacilitiesRepository],
})
export class FacilitiesModule {}

