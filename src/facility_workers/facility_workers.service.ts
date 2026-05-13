import { Injectable } from '@nestjs/common';
import { CreateFacilityWorkerDto } from './dto/request/create-facility_worker.dto';
import { UpdateFacilityWorkerDto } from './dto/request/update-facility_worker.dto';
import { FacilityWorkersRepository } from './repository/facility_workers.repository.impl';
import { FacilityWorkerResponseDto } from './dto/response/facility_worker.response.dto';

@Injectable()
export class FacilityWorkersService {

  constructor(private readonly facilityWorkersRepository: FacilityWorkersRepository) {}

  create(createFacilityWorkerDto: CreateFacilityWorkerDto): Promise<FacilityWorkerResponseDto> {
    return this.facilityWorkersRepository.create(createFacilityWorkerDto);
  }

  update(id: number, updateFacilityWorkerDto: UpdateFacilityWorkerDto): Promise<FacilityWorkerResponseDto> {
    return this.facilityWorkersRepository.update(id, updateFacilityWorkerDto);
  }
}
