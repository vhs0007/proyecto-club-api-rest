import { CreateActivityDto } from '../dto/create-activities.dto';
import { UpdateActivityDto } from '../dto/update-activities.dto';

export type ActivityResponse = {
  id: number;
  name: string;
  type: string;
  startAt: Date;
  endAt: Date;
  userId: number;
  cost: number;
  facilityId: number;
  isActive: boolean;
};

export interface IActivitiesRepository {
  create(createActivityDto: CreateActivityDto): Promise<ActivityResponse>;
  findAll(): Promise<ActivityResponse[]>;
  findById(id: number): Promise<ActivityResponse | null>;
  update(id: number, updateActivityDto: UpdateActivityDto): Promise<ActivityResponse>;
  delete(id: number): Promise<void>;
}
