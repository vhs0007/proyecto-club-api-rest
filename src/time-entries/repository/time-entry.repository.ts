import { CreateTimeEntryDto } from '../dto/request/create-time-entry.dto';
import { UpdateTimeEntryDto } from '../dto/request/update-time-entry.dto';
import { TimeEntryResponseDto } from '../dto/response/time-entry.response.dto';

export interface userNavigation {
  id: number;
  name: string;
  email: string | null;
  createdAt: Date;
  isActive: boolean;
  type: userTypeNavigation;
}

export interface userTypeNavigation {
  id: number;
  name: string;
}

export interface ITimeEntryRepository {
  findAll(clubId: number): Promise<TimeEntryResponseDto[]>;
  findOne(id: number): Promise<TimeEntryResponseDto>;
  create(timeEntry: CreateTimeEntryDto): Promise<TimeEntryResponseDto>;
  update(
    id: number,
    timeEntry: UpdateTimeEntryDto,
  ): Promise<TimeEntryResponseDto>;
}
