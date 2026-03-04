import { Activity } from "../entities/activity.entity";
import { CreateActivityDto } from "../dto/create-activities.dto";
import { UpdateActivityDto } from "../dto/update-activities.dto";

export interface IActivitiesRepository {
    create(createActivityDto: CreateActivityDto): Promise<Activity>;
    findAll(): Promise<Activity[]>;
    findById(id: number): Promise<Activity>;
    update(id: number, updateActivityDto: UpdateActivityDto): Promise<Activity>;
    delete(id: number): Promise<void>;
}