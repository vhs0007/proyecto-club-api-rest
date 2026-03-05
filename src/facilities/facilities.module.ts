import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesRepository } from './repository/facilities.repository.impl';

@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService, FacilitiesRepository],
})
export class FacilitiesModule {}

