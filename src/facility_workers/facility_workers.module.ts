import { Module } from '@nestjs/common';
import { FacilityWorkersService } from './facility_workers.service';
import { FacilityWorkersController } from './facility_workers.controller';
import { FacilityWorkersRepository } from './repository/facility_workers.repository.impl';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FacilityWorkersController],
  providers: [FacilityWorkersService, FacilityWorkersRepository],
})
export class FacilityWorkersModule {}
