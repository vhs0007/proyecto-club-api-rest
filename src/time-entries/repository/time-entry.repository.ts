import { CreateTimeEntryDto } from "../dto/create-time-entry.dto";
import { UpdateTimeEntryDto } from "../dto/update-time-entry.dto";

export interface TimeEntryResponse {
  id: number;
  clubId: number;
  user: userNavigation;
  userDocument: string;
  clockIn: Date;
  clockOut?: Date | null;
}

export interface userNavigation{
    id: number;
    name: string;
    email: string | null;
    createdAt: Date;
    isActive: boolean;
    type: userTypeNavigation;
}

export interface userTypeNavigation{
  id: number;
  name: string;
}

export interface ITimeEntryRepository {
  findAll(clubId: number): Promise<TimeEntryResponse[]>;
  findOne(id: number): Promise<TimeEntryResponse>;
  create(timeEntry: CreateTimeEntryDto): Promise<TimeEntryResponse>;
  update(id: number, timeEntry: UpdateTimeEntryDto): Promise<TimeEntryResponse>;
}