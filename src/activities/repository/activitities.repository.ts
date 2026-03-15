import { CreateActivityDto } from '../dto/request/create-activities.dto';
import { UpdateActivityDto } from '../dto/request/update-activities.dto';

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
  name: string;
  capacity: number;
  responsibleWorker: UserNavigation;
  assistantWorker: UserNavigation | null;
  isActive: boolean;
};

export type ActivityResponse = {
  id: number;
  name: string;
  type: string;
  startAt: Date;
  endAt: Date;
  user: UserNavigation;
  cost: number;
  facility: FacilityNavigation;
  isActive: boolean;
};

export interface IActivitiesRepository {
  create(createActivityDto: CreateActivityDto): Promise<ActivityResponse>;
  findAll(): Promise<ActivityResponse[]>;
  findById(id: number): Promise<ActivityResponse | null>;
  update(id: number, updateActivityDto: UpdateActivityDto): Promise<ActivityResponse>;
  delete(id: number): Promise<void>;
}
