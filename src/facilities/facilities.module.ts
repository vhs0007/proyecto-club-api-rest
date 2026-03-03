import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesRepository } from './facilities.repository';

@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService, FacilitiesRepository],
})
export class FacilitiesModule {}

