import {
  Injectable, NotFoundException,
} from '@nestjs/common';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { Facilities } from './entities/facilities.entity';
import { Facility } from './entities/facility.entity';

@Injectable()
export class FacilitiesService {
  facilities: Facilities[] = [
    new Facility({
      id: 1,
      tipo: 'cancha',
      horarioDisponible: '08:00-22:00',
      aforo: 100,
      trabajadorEncargado: 1,
      trabajadorAyudante: null,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      isActive: true,
    }),
    new Facility({
      id: 2,
      tipo: 'gimnasio',
      horarioDisponible: '06:00-23:00',
      aforo: 50,
      trabajadorEncargado: 2,
      trabajadorAyudante: 3,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      isActive: true,
    }),
  ];

  private findById(id: number): Facilities | null {
    const facility = this.facilities.find((f) => f.id === id);
    if (facility) return facility;
    return null;
  }

  create(createFacilityDto: CreateFacilityDto): Facilities {
    const now = new Date();
    const id = Math.max(0, ...this.facilities.map((f) => f.id)) + 1;
    const facility = new Facility({
      ...createFacilityDto,
      id,
      createdAt: createFacilityDto.createdAt ?? now,
      updatedAt: null as Date | null,
      deletedAt: null as Date | null,
      isActive: createFacilityDto.isActive ?? true,
      trabajadorAyudante: createFacilityDto.trabajadorAyudante ?? null,
    });
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

  update(id: number, updateFacilityDto: UpdateFacilityDto): Facilities {
    const entity = this.findById(id);
    if (!entity) {
      throw new NotFoundException('Facility not found');
    }
    
    entity.tipo = updateFacilityDto.tipo ?? entity.tipo;
    entity.horarioDisponible = updateFacilityDto.horarioDisponible ?? entity.horarioDisponible;
    entity.aforo = updateFacilityDto.aforo ?? entity.aforo;
    entity.trabajadorEncargado = updateFacilityDto.trabajadorEncargado ?? entity.trabajadorEncargado;
    entity.trabajadorAyudante = updateFacilityDto.trabajadorAyudante ?? entity.trabajadorAyudante;
    entity.isActive = updateFacilityDto.isActive ?? entity.isActive;
    entity.updatedAt = new Date();
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

