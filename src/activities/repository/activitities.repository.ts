import { Activity } from "../entities/activity.entity";
import { CreateActivityDto } from "../dto/create-activities.dto";
import { UpdateActivityDto } from "../dto/update-activities.dto";

export interface IActivitiesRepository {
  create(createActivityDto: CreateActivityDto): Promise<CreateActivityDto>;
  findAll(): Promise<CreateActivityDto[]>;
  findById(id: number): Promise<CreateActivityDto | null>;
  update(id: number, updateActivityDto: UpdateActivityDto): Promise<UpdateActivityDto>;
  delete(id: number): Promise<void>;
}