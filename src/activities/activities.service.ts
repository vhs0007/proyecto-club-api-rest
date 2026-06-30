import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/request/create-activities.dto';
import { UpdateActivityDto } from './dto/request/update-activities.dto';
import { ActivityResponseDto } from './dto/response/activity-response.dto';
import { ActivitiesRepository } from './repository/activities.repository.impl';
import { QueryActivitiesRequestDto } from './dto/request/query-activities.request.dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly activitiesRepository: ActivitiesRepository) {}

  async create(
    createActivityDto: CreateActivityDto,
  ): Promise<ActivityResponseDto> {
    return this.activitiesRepository.create(createActivityDto);
  }

  async findAll(clubId: number): Promise<ActivityResponseDto[]> {
    const list = await this.activitiesRepository.findAll(clubId);
    return list;
  }

  async findOne(
    query: QueryActivitiesRequestDto,
  ): Promise<ActivityResponseDto> {
    const row = await this.activitiesRepository.findById(query);
    if (!row) throw new NotFoundException('Activity not found');
    return row;
  }

  async update(
    query: QueryActivitiesRequestDto,
    updateActivityDto: UpdateActivityDto,
  ): Promise<ActivityResponseDto> {
    return this.activitiesRepository.update(query, updateActivityDto);
  }

  async remove(query: QueryActivitiesRequestDto): Promise<ActivityResponseDto> {
    const row = await this.activitiesRepository.findById(query);
    if (!row) throw new NotFoundException('Activity not found');
    if (row.state === 'COMPLETADO' || row.state === 'SEÑADA') {
      throw new BadRequestException(
        'No se puede eliminar una actividad en estado COMPLETADO o SEÑADA',
      );
    }
    await this.activitiesRepository.delete(query);
    return row;
  }
}
