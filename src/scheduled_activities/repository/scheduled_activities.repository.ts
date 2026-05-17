import { CreateScheduledActivityDto } from "../dto/request/create-scheduled_activity.dto";
import { ScheduledActivityResponseDto } from "../dto/response/scheduled_activity.response.dto";
import { UpdateScheduledActivityDto } from "../dto/request/update-scheduled_activity.dto";
import { QueryScheduledActivityDto } from "../dto/request/query-scheduled_activity.dto";

export interface UserNavigation {
    id: number;
    name: string;
    typeId: number;
    email: string | null;
    createdAt: Date;
    deletedAt: Date | null;
    isActive: boolean;
    document: string;
  }
  
export interface FacilityNavigation {
    id: number;
    type: string;
    capacity: number;
    responsibleWorker: UserNavigation | null;
    assistantWorkers: UserNavigation[] | null;
    isActive: boolean;
}

export interface ScheduledActivityRepository {
    create(createScheduledActivityDto: CreateScheduledActivityDto): Promise<ScheduledActivityResponseDto>;
    findAll(clubId: number): Promise<ScheduledActivityResponseDto[]>;
    findById(query: QueryScheduledActivityDto): Promise<ScheduledActivityResponseDto>;
    update(query: QueryScheduledActivityDto, updateScheduledActivityDto: UpdateScheduledActivityDto): Promise<ScheduledActivityResponseDto>;
    delete(query: QueryScheduledActivityDto): Promise<void>;
}

export default ScheduledActivityRepository;