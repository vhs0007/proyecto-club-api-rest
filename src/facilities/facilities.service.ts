import {
  Injectable, NotFoundException,
} from '@nestjs/common';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { Facility } from './entities/facility.entity';
import { FacilitiesRepository } from './repository/facilities.repository.impl';
import type { FacilityResponse } from './repository/facilities.repository';

@Injectable()
export class FacilitiesService {
  constructor(private readonly facilitiesRepository: FacilitiesRepository) {}

  private mapResponseToFacility(res: FacilityResponse): Facility {
    return new Facility({
      id: res.id,
      type: res.type,
      capacity: res.capacity,
      responsibleWorker: res.responsibleWorker,
      assistantWorker: res.assistantWorker ?? null,
      isActive: res.isActive ?? true,
      membership: [],
    });
  }

  async create(createFacilityDto: CreateFacilityDto): Promise<Facility> {
    const res = await this.facilitiesRepository.create(createFacilityDto);
    return this.mapResponseToFacility(res);
  }

  async findAll(): Promise<Facility[]> {
    const list = await this.facilitiesRepository.findAll();
    return list.map((r) => this.mapResponseToFacility(r));
  }

  async findOne(id: number): Promise<Facility> {
    const row = await this.facilitiesRepository.findById(id);
    if (!row) throw new NotFoundException('Facility not found');
    return this.mapResponseToFacility(row);
  }

  async update(id: number, updateFacilityDto: UpdateFacilityDto): Promise<Facility> {
    const row = await this.facilitiesRepository.findById(id);
    if (!row) throw new NotFoundException('Facility not found');
    const updated = await this.facilitiesRepository.update(id, updateFacilityDto);
    return this.mapResponseToFacility(updated);
  }

  async remove(id: number): Promise<Facility> {
    const row = await this.facilitiesRepository.findById(id);
    if (!row) throw new NotFoundException('Facility not found');
    await this.facilitiesRepository.delete(id);
    return this.mapResponseToFacility(row);
  }
}
