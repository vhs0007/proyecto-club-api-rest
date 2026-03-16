import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFacilityDto } from './dto/request/create-facility.dto';
import { UpdateFacilityDto } from './dto/request/update-facility.dto';
import { Facility } from './entities/facility.entity';
import { FacilitiesRepository } from './repository/facilities.repository.impl';
import type { FacilityResponse, WorkerNavigation } from './repository/facilities.repository';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipType } from '../membership_type/entities/membership_type.entity';
import { Worker } from '../users/entities/worker.entity';
import { UserType } from '../users/entities/user.entity';

@Injectable()
export class FacilitiesService {
  constructor(
    private readonly facilitiesRepository: FacilitiesRepository,
    private readonly prisma: PrismaService,
  ) {}

  private mapResponseToWorker(res: WorkerNavigation): Worker {
    const userType = res.type.id as UserType;
    return new Worker({
      id: res.id,
      name: res.name,
      type: userType,
      email: res.email ?? null,
      password: res.password ?? null,
      createdAt: res.createdAt ?? new Date(0),
      updatedAt: null,
      deletedAt: res.deletedAt ?? null,
      isActive: res.isActive ?? true,
      salary: 0,
      hoursToWorkPerDay: null,
      startWorkAt: new Date(0),
      endWorkAt: new Date(0),
    });
  }

  private mapResponseToFacility(res: FacilityResponse): Facility {
    const membershipTypes = (res.membershipTypes ?? []).map(
      (mt) => new MembershipType({ id: mt.id, name: mt.name, price: mt.price }),
    );
    return new Facility({
      id: res.id,
      type: res.type,
      capacity: res.capacity,
      responsibleWorker: this.mapResponseToWorker(res.responsibleWorker),
      assistantWorker: res.assistantWorker != null ? this.mapResponseToWorker(res.assistantWorker) : null,
      isActive: res.isActive ?? true,
      membershipTypes,
    });
  }

  private async ensureWorker(userId: number, field: string): Promise<void> {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException(`${field} not found`);
    const workerType = await this.prisma.user_type.findFirst({ where: { name: 'worker' } });
    if (!workerType) throw new BadRequestException('Worker user type is not configured in the database');
    if (user.typeId !== workerType.id) throw new BadRequestException(`${field} must be a Worker user`);
  }

  private async ensureMembershipTypes(membershipTypeIds: number[]): Promise<void> {
    if (membershipTypeIds.length === 0) return;
    const existing = await this.prisma.membership_type.findMany({
      where: { id: { in: membershipTypeIds } },
      select: { id: true },
    });
    const existingIds = new Set(existing.map((t) => t.id));
    const invalid = membershipTypeIds.filter((id) => !existingIds.has(id));
    if (invalid.length > 0) {
      throw new BadRequestException(`Membership type id(s) not found: ${invalid.join(', ')}`);
    }
  }

  async create(createFacilityDto: CreateFacilityDto): Promise<Facility> {
    await this.ensureWorker(createFacilityDto.responsibleWorker, 'Responsible worker');
    if (createFacilityDto.assistantWorker != null) {
      await this.ensureWorker(createFacilityDto.assistantWorker, 'Assistant worker');
    }
    await this.ensureMembershipTypes(createFacilityDto.membershipTypeIds);
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
