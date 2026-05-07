import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimeEntryDto } from './dto/request/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/request/update-time-entry.dto';
import { TimeEntryResponseDto } from './dto/response/time-entry.response.dto';
import { TimeEntryRepository } from './repository/time-entry.repository.impl';

@Injectable()
export class TimeEntriesService {
  constructor(private readonly timeEntriesRepository: TimeEntryRepository) {}

  async create(
    createTimeEntryDto: CreateTimeEntryDto,
  ): Promise<TimeEntryResponseDto> {
    return this.timeEntriesRepository.create(createTimeEntryDto);
  }

  async findAll(clubId: number): Promise<TimeEntryResponseDto[]> {
    const timeEntries = await this.timeEntriesRepository.findAll(clubId);
    return timeEntries;
  }

  async findOne(id: number): Promise<TimeEntryResponseDto> {
    const row = await this.timeEntriesRepository.findOne(id);
    if (!row) throw new NotFoundException('Time entry not found');
    return row;
  }

  async update(
    id: number,
    updateTimeEntryDto: UpdateTimeEntryDto,
  ): Promise<TimeEntryResponseDto> {
    const row = await this.timeEntriesRepository.update(id, updateTimeEntryDto);
    if (!row) throw new NotFoundException('Time entry not found');
    return row;
  }
}
