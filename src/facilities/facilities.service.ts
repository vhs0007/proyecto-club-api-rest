import {
  Injectable, NotFoundException,
} from '@nestjs/common';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { Facility } from './entities/facility.entity';

@Injectable()
export class FacilitiesService {
  facilities: CreateFacilityDto[] = [
    {
      id: 1,
      type: 'cancha',
      capacity: 100,
      responsibleWorker: 1,
      assistantWorker: 2,
      membershipIds: [1, 2],
    },
    {
      id: 2,
      type: 'gimnasio',
      capacity: 50,
      responsibleWorker: 2,
      assistantWorker: 3,
      membershipIds: [1, 2],
    },
  ];

  private findById(id: number): CreateFacilityDto | null {
    const facility = this.facilities.find((f) => f.id === id);
    if (facility) return facility;
    return null;
  }

  create(createFacilityDto: CreateFacilityDto): CreateFacilityDto {
    const now = new Date();
    const id = Math.max(0, ...this.facilities.map((f) => f.id ?? 0)) + 1;
    const facility: CreateFacilityDto = {
      ...createFacilityDto,
      id,
    };
    this.facilities.push(facility);
    return facility;
  }

  findAll() {
    return this.facilities;
  }

  findOne(id: number) {
    const entity = this.findById(id);
    if (!entity) {
      throw new NotFoundException('Facility not found');
    }
    return entity;
  }

  update(id: number, updateFacilityDto: UpdateFacilityDto): CreateFacilityDto {
    const entity = this.findById(id);
    if (!entity) {
      throw new NotFoundException('Facility not found');
    }
    
    entity.type = updateFacilityDto.type ?? entity.type;
    entity.capacity = updateFacilityDto.capacity ?? entity.capacity;
    entity.responsibleWorker = updateFacilityDto.responsibleWorker ?? entity.responsibleWorker;
    entity.assistantWorker = updateFacilityDto.assistantWorker ?? entity.assistantWorker;
    entity.membershipIds = updateFacilityDto.membershipIds ?? entity.membershipIds;
    return entity;
  }

  remove(id: number) {
    const entity = this.findById(id);
    if (!entity) {
      throw new NotFoundException('Facility not found');
    }

    this.facilities = this.facilities.filter((f) => f.id !== id);
    return entity;
  }
}

