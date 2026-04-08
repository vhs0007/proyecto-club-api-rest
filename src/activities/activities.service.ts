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

  private toMinutes(hour: string): number {
    const [hh, mm] = hour.split(':').map((value) => Number(value));
    return (hh * 60) + mm;
  }

  private toDto(row: ActivityResponse): ActivityResponseDto {
    return{
      id: row.id,
      name: row.name,
      type: row.type,
      hourStart: row.hourStart,
      hourEnd: row.hourEnd,
      date: row.date,
      user: row.user,
      cost: row.cost,
      facility: row.facility,
      isActive: row.isActive,
      document: row.document,
    }
  }

  async create(createActivityDto: CreateActivityDto): Promise<ActivityResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: {
        id_clubId_typeId: {
          id: createActivityDto.userId,
          clubId: createActivityDto.clubId,
          typeId: createActivityDto.userTypeId,
        },
      },
    });
    if (!user) throw new BadRequestException('User not found');
    const facility = await this.prisma.facilities.findUnique({ where: { id: createActivityDto.facilityId } });
    if (!facility) throw new BadRequestException('Facility not found');
    if (this.toMinutes(createActivityDto.hourStart) >= this.toMinutes(createActivityDto.hourEnd)) {
      throw new BadRequestException('hourStart must be before hourEnd');
    }
    const result = await this.activitiesRepository.create(createActivityDto);
    return this.toDto(result);
  }

  async findAll(clubId: number): Promise<ActivityResponseDto[]> {
    const list = await this.activitiesRepository.findAll(clubId);
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
      const user = await this.prisma.users.findUnique({
        where: {
          id_clubId_typeId: {
            id: updateActivityDto.userId,
            clubId: row.clubId,
            typeId: updateActivityDto.userTypeId,
          },
        },
      });
      if (!user) throw new BadRequestException('User not found');
    }
    if (updateActivityDto.facilityId !== undefined) {
      const facility = await this.prisma.facilities.findUnique({ where: { id: updateActivityDto.facilityId } });
      if (!facility) throw new BadRequestException('Facility not found');
    }
    const hourStart = updateActivityDto.hourStart !== undefined ? updateActivityDto.hourStart : row.hourStart;
    const hourEnd = updateActivityDto.hourEnd !== undefined ? updateActivityDto.hourEnd : row.hourEnd;
    if (this.toMinutes(hourStart) >= this.toMinutes(hourEnd)) {
      throw new BadRequestException('hourStart must be before hourEnd');
    }
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
