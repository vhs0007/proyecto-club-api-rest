import { CreateActivityDto } from '../dto/request/create-activities.dto';
import { UpdateActivityDto } from '../dto/request/update-activities.dto';
import { QueryActivitiesRequestDto } from '../dto/request/query-activities.request.dto';
import { ActivityResponseDto } from '../dto/response/activity-response.dto';
import type {
  FacilityNavigation,
  UserNavigation,
} from '../../facilities/repository/facilities.repository';

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
  state: string;
  clubId: number;
  document: string;
};

export interface IActivitiesRepository {
  create(createActivityDto: CreateActivityDto): Promise<ActivityResponseDto>;
  findAll(clubId: number): Promise<ActivityResponseDto[]>;
  findById(
    query: QueryActivitiesRequestDto,
  ): Promise<ActivityResponseDto | null>;
  update(
    query: QueryActivitiesRequestDto,
    updateActivityDto: UpdateActivityDto,
  ): Promise<ActivityResponseDto>;
  delete(query: QueryActivitiesRequestDto): Promise<void>;
}
