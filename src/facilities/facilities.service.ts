import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFacilityDto } from './dto/request/create-facility.dto';
import { UpdateFacilityDto } from './dto/request/update-facility.dto';
import { Facility } from './entities/facility.entity';
import { FacilitiesRepository } from './repository/facilities.repository.impl';
import type { FacilityResponse } from './repository/facilities.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FacilitiesService {
  constructor(
    private readonly facilitiesRepository: FacilitiesRepository,
    private readonly prisma: PrismaService,
  ) {}

  private mapResponseToFacility(res: FacilityResponse): Facility {
    return new Facility({
      id: res.id,
      type: res.type,
      capacity: res.capacity,
      responsibleWorker: res.responsibleWorker.id,
      assistantWorker: res.assistantWorker?.id ?? null,
      isActive: res.isActive ?? true,
      membership: [],
    });
  }

  private async ensureWorker(userId: number, field: string): Promise<void> {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException(`${field} not found`);
    const workerType = await this.prisma.user_type.findFirst({ where: { name: 'Worker' } });
    if (!workerType) throw new BadRequestException('Worker user type is not configured in the database');
    if (user.typeId !== workerType.id) throw new BadRequestException(`${field} must be a Worker user`);
  }

  async create(createFacilityDto: CreateFacilityDto): Promise<Facility> {
    await this.ensureWorker(createFacilityDto.responsibleWorker, 'Responsible worker');
    if (createFacilityDto.assistantWorker != null) {
      await this.ensureWorker(createFacilityDto.assistantWorker, 'Assistant worker');
    }
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
    if (updateFacilityDto.responsibleWorker !== undefined) {
      await this.ensureWorker(updateFacilityDto.responsibleWorker, 'Responsible worker');
    }
    if (updateFacilityDto.assistantWorker !== undefined && updateFacilityDto.assistantWorker != null) {
      await this.ensureWorker(updateFacilityDto.assistantWorker, 'Assistant worker');
    }
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
