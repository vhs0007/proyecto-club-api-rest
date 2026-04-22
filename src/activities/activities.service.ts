import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/request/create-activities.dto';
import { UpdateActivityDto } from './dto/request/update-activities.dto';
import { ActivityResponseDto } from './dto/response/activity-response.dto';
import { ActivitiesRepository } from './repository/activities.repository.impl';
import { PrismaService } from '../prisma/prisma.service';
import {QueryActivitiesRequestDto} from './dto/request/query-activities.request.dto';

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
    const facility = await this.prisma.facilities.findUnique({ where: { id_clubId: {id: createActivityDto.facilityId, clubId: createActivityDto.clubId} } });
    if (!facility) throw new BadRequestException('Facility not found');
    if (this.toMinutes(createActivityDto.hourStart) >= this.toMinutes(createActivityDto.hourEnd)) {
      throw new BadRequestException('hourStart must be before hourEnd');
    }
    const result = await this.activitiesRepository.create(createActivityDto);
    return result;
  }

  async findAll(clubId: number): Promise<ActivityResponseDto[]> {
    const list = await this.activitiesRepository.findAll(clubId);
    return list;
  }

  async findOne(query: QueryActivitiesRequestDto): Promise<ActivityResponseDto> {
    const row = await this.activitiesRepository.findById(query);
    if (!row) throw new NotFoundException('Activity not found');
    return row;
  }

  async update(query: QueryActivitiesRequestDto, updateActivityDto: UpdateActivityDto): Promise<ActivityResponseDto> {
    const row = await this.activitiesRepository.findById(query);
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
      const facility = await this.prisma.facilities.findUnique({ where: { id_clubId: {id: updateActivityDto.facilityId, clubId: query.clubId} } });
      if (!facility) throw new BadRequestException('Facility not found');
    }
    const hourStart = updateActivityDto.hourStart !== undefined ? updateActivityDto.hourStart : row.hourStart;
    const hourEnd = updateActivityDto.hourEnd !== undefined ? updateActivityDto.hourEnd : row.hourEnd;
    if (this.toMinutes(hourStart) >= this.toMinutes(hourEnd)) {
      throw new BadRequestException('hourStart must be before hourEnd');
    }
    const result = await this.activitiesRepository.update(query, updateActivityDto);
    return result;
  }

  async remove(query: QueryActivitiesRequestDto): Promise<ActivityResponseDto> {
    const row = await this.activitiesRepository.findById(query);
    if (!row) throw new NotFoundException('Activity not found');
    await this.activitiesRepository.delete(query);
    return row;
  }
}
