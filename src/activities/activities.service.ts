import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/request/create-activities.dto';
import { UpdateActivityDto } from './dto/request/update-activities.dto';
import { ActivityResponseDto } from './dto/response/activity-response.dto';
import type { ActivityResponse } from './repository/activitities.repository';
import { ActivitiesRepository } from './repository/activities.repository.impl';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly activitiesRepository: ActivitiesRepository,
    private readonly prisma: PrismaService,
  ) {}

  private toDto(row: ActivityResponse): ActivityResponseDto {
    return{
      id: row.id,
      name: row.name,
      type: row.type,
      startAt: row.startAt,
      endAt: row.endAt,
      user: row.user,
      cost: row.cost,
      facility: row.facility,
      isActive: row.isActive,
    }
  }

  async create(createActivityDto: CreateActivityDto): Promise<ActivityResponseDto> {
    const user = await this.prisma.users.findUnique({ where: { id: createActivityDto.userId } });
    if (!user) throw new BadRequestException('User not found');
    const facility = await this.prisma.facilities.findUnique({ where: { id: createActivityDto.facilityId } });
    if (!facility) throw new BadRequestException('Facility not found');
    if (new Date(createActivityDto.startAt) >= new Date(createActivityDto.endAt)) {
      throw new BadRequestException('startAt must be before endAt');
    }
    const result = await this.activitiesRepository.create(createActivityDto);
    return this.toDto(result);
  }

  async findAll(): Promise<ActivityResponseDto[]> {
    const list = await this.activitiesRepository.findAll();
    return list.map((row) => this.toDto(row));
  }

  async findOne(id: number): Promise<ActivityResponseDto> {
    const row = await this.activitiesRepository.findById(id);
    if (!row) throw new NotFoundException('Activity not found');
    return this.toDto(row);
  }

  async update(id: number, updateActivityDto: UpdateActivityDto): Promise<ActivityResponseDto> {
    const row = await this.activitiesRepository.findById(id);
    if (!row) throw new NotFoundException('Activity not found');
    if (updateActivityDto.userId !== undefined) {
      const user = await this.prisma.users.findUnique({ where: { id: updateActivityDto.userId } });
      if (!user) throw new BadRequestException('User not found');
    }
    if (updateActivityDto.facilityId !== undefined) {
      const facility = await this.prisma.facilities.findUnique({ where: { id: updateActivityDto.facilityId } });
      if (!facility) throw new BadRequestException('Facility not found');
    }
    const startAt = updateActivityDto.startAt !== undefined ? new Date(updateActivityDto.startAt) : new Date(row.startAt);
    const endAt = updateActivityDto.endAt !== undefined ? new Date(updateActivityDto.endAt) : new Date(row.endAt);
    if (startAt >= endAt) throw new BadRequestException('startAt must be before endAt');
    const result = await this.activitiesRepository.update(id, updateActivityDto);
    return this.toDto(result);
  }

  async remove(id: number): Promise<ActivityResponseDto> {
    const row = await this.activitiesRepository.findById(id);
    if (!row) throw new NotFoundException('Activity not found');
    await this.activitiesRepository.delete(id);
    return this.toDto(row);
  }
}
