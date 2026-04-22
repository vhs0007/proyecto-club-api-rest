import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFacilityDto } from './dto/request/create-facility.dto';
import { UpdateFacilityDto } from './dto/request/update-facility.dto';
import { FacilitiesRepository } from './repository/facilities.repository.impl';
import { PrismaService } from '../prisma/prisma.service';
import { FacilityResponseDto } from './dto/response/facility-response.dto';
import { QueryFacilitiesRequestDto } from './dto/request/query-facilities.request.dto';

@Injectable()
export class FacilitiesService {
  constructor(
    private readonly facilitiesRepository: FacilitiesRepository,
    private readonly prisma: PrismaService,
  ) {}

  private async ensureWorker(userId: number, clubId: number, field: string): Promise<void> {
    const user = await this.prisma.users.findUnique({
      where: {
        id_clubId_typeId: {
          id: userId,
          clubId,
          typeId: 1,
        },
      },
    });
    if (!user) throw new BadRequestException(`${field} not found`);
    const workerType = await this.prisma.user_type.findFirst({
      where: { name: { equals: 'Trabajador', mode: 'insensitive' } },
    });
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

  async create(createFacilityDto: CreateFacilityDto): Promise<FacilityResponseDto> {
    await this.ensureWorker(createFacilityDto.responsibleWorker, createFacilityDto.clubId, 'Responsible worker');
    if (createFacilityDto.assistantWorker != null) {
      await this.ensureWorker(createFacilityDto.assistantWorker, createFacilityDto.clubId, 'Assistant worker');
    }
    await this.ensureMembershipTypes(createFacilityDto.membershipTypeIds);
    const res = await this.facilitiesRepository.create(createFacilityDto);
    return res;
  }

  async findAll(clubId: number): Promise<FacilityResponseDto[]> {
    const list = await this.facilitiesRepository.findAll(clubId);
    return list;
  }

  async findOne(query: QueryFacilitiesRequestDto): Promise<FacilityResponseDto> {
    const row = await this.facilitiesRepository.findById(query);
    if (!row) throw new NotFoundException('Facility not found');
    return row;
  }

  async update(query: QueryFacilitiesRequestDto, updateFacilityDto: UpdateFacilityDto): Promise<FacilityResponseDto> {
    const row = await this.facilitiesRepository.findById(query);
    if (!row) throw new NotFoundException('Facility not found');
    const facility = await this.prisma.facilities.findUnique({
      where: { id_clubId: {id: query.id, clubId: query.clubId} },
      select: { clubId: true },
    });
    if (!facility) throw new NotFoundException('Facility not found');
    if (updateFacilityDto.responsibleWorker !== undefined) {
      await this.ensureWorker(updateFacilityDto.responsibleWorker, facility.clubId, 'Responsible worker');
    }
    if (updateFacilityDto.assistantWorker !== undefined && updateFacilityDto.assistantWorker != null) {
      await this.ensureWorker(updateFacilityDto.assistantWorker, facility.clubId, 'Assistant worker');
    }
    if (updateFacilityDto.membershipTypeIds !== undefined) {
      await this.ensureMembershipTypes(updateFacilityDto.membershipTypeIds);
    }
    const updated = await this.facilitiesRepository.update(query, updateFacilityDto);
    return updated;
  }

  async remove(query: QueryFacilitiesRequestDto): Promise<FacilityResponseDto> {
    const row = await this.facilitiesRepository.findById(query);
    if (!row) throw new NotFoundException('Facility not found');
    await this.facilitiesRepository.delete(query);
    return row;
  }
}
