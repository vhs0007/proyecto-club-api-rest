import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activities.dto';
import { UpdateActivityDto } from './dto/update-activities.dto';
import type { ActivityResponseDto } from './dto/activity-response.dto';
import { ActivitiesRepository } from './repository/activities.repository.impl';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly activitiesRepository: ActivitiesRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<ActivityResponseDto> {
    const user = await this.prisma.users.findUnique({ where: { id: createActivityDto.userId } });
    if (!user) throw new BadRequestException('User not found');
    const facility = await this.prisma.facilities.findUnique({ where: { id: createActivityDto.facilityId } });
    if (!facility) throw new BadRequestException('Facility not found');
    if (new Date(createActivityDto.startAt) >= new Date(createActivityDto.endAt)) {
      throw new BadRequestException('startAt must be before endAt');
    }
    return this.activitiesRepository.create(createActivityDto);
  }

  async findAll(): Promise<ActivityResponseDto[]> {
    return this.activitiesRepository.findAll();
  }

  async findOne(id: number): Promise<ActivityResponseDto> {
    const row = await this.activitiesRepository.findById(id);
    if (!row) throw new NotFoundException('Activity not found');
    return row;
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
    return this.activitiesRepository.update(id, updateActivityDto);
  }

  async remove(id: number): Promise<ActivityResponseDto> {
    const row = await this.activitiesRepository.findById(id);
    if (!row) throw new NotFoundException('Activity not found');
    await this.activitiesRepository.delete(id);
    return row;
  }
}
