import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { TimeEntry } from './entities/time-entry.entity';
import { TimeEntryResponse } from './repository/time-entry.repository';
import { TimeEntryRepository } from './repository/time-entry.repository.impl';

@Injectable()
export class TimeEntriesService {
  constructor(private readonly timeEntriesRepository: TimeEntryRepository) {}

  async create(createTimeEntryDto: CreateTimeEntryDto): Promise<TimeEntryResponse> {
    return this.timeEntriesRepository.create(createTimeEntryDto);
  }

  async findAll(clubId: number): Promise<TimeEntryResponse[]> {
    const timeEntries = await this.timeEntriesRepository.findAll(clubId);
    return timeEntries;
  }

  async findOne(id: number): Promise<TimeEntryResponse> {
    const row = await this.timeEntriesRepository.findOne(id);
    if (!row) throw new NotFoundException('Time entry not found');
    return row;
  }

  async update(id: number, updateTimeEntryDto: UpdateTimeEntryDto): Promise<TimeEntryResponse> {
    const row = await this.timeEntriesRepository.update(id, updateTimeEntryDto);
    if (!row) throw new NotFoundException('Time entry not found');
    return row;
  }

}
