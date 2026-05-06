import { CreateActivityDto } from '../dto/request/create-activities.dto';
import { UpdateActivityDto } from '../dto/request/update-activities.dto';
import {QueryActivitiesRequestDto} from '../dto/request/query-activities.request.dto';
import { ActivityResponseDto } from '../dto/response/activity-response.dto';

export interface UserNavigation {
  id: number;
  name: string;
  typeId: number;
  email: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
  document: string;
};

export interface FacilityNavigation {
  id: number;
  type: string;
  capacity: number;
  responsibleWorker: UserNavigation | null;
  assistantWorkers: UserNavigation[] | null;
  isActive: boolean;
};

export interface IActivitiesRepository {
  create(createActivityDto: CreateActivityDto): Promise<ActivityResponseDto>;
  findAll(clubId: number): Promise<ActivityResponseDto[]>;
  findById(query: QueryActivitiesRequestDto): Promise<ActivityResponseDto | null>;
  update(query: QueryActivitiesRequestDto, updateActivityDto: UpdateActivityDto): Promise<ActivityResponseDto>;
  delete(query: QueryActivitiesRequestDto): Promise<void>;
}
