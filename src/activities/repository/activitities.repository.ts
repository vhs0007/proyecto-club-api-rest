import { CreateActivityDto } from '../dto/request/create-activities.dto';
import { UpdateActivityDto } from '../dto/request/update-activities.dto';
import {QueryActivitiesRequestDto} from '../dto/request/query-activities.request.dto';

export interface UserNavigation {
  id: number;
  name: string;
  typeId: number;
  email: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
};

export interface FacilityNavigation {
  id: number;
  type: string;
  capacity: number;
  responsibleWorker: UserNavigation;
  assistantWorker: UserNavigation | null;
  isActive: boolean;
};

export type ActivityResponse = {
  id: number;
  name: string;
  type: string;
  hourStart: string;
  hourEnd: string;
  date: Date;
  user: UserNavigation;
  cost: number;
  facility: FacilityNavigation;
  isActive: boolean;
  clubId: number;
  document: string;
};

export interface IActivitiesRepository {
  create(createActivityDto: CreateActivityDto): Promise<ActivityResponse>;
  findAll(clubId: number): Promise<ActivityResponse[]>;
  findById(query: QueryActivitiesRequestDto): Promise<ActivityResponse | null>;
  update(query: QueryActivitiesRequestDto, updateActivityDto: UpdateActivityDto): Promise<ActivityResponse>;
  delete(query: QueryActivitiesRequestDto): Promise<void>;
}
