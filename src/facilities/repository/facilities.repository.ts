import { CreateFacilityDto } from '../dto/request/create-facility.dto';
import { UpdateFacilityDto } from '../dto/request/update-facility.dto';
import { QueryFacilitiesRequestDto } from '../dto/request/query-facilities.request.dto';
import { FacilityResponseDto } from '../dto/response/facility-response.dto';

export interface UserTypeNavigation {
  id: number;
  name: string;
}

export interface UserNavigation {
  id: number;
  name: string;
  type: UserTypeNavigation;
  email: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
}

export interface MembershipTypeNavigation {
  id: number;
  name: string;
  price: number;
}

export interface FacilityNavigation {
  id: number;
  type: string;
  capacity: number;
  isActive: boolean;
  responsibleWorker: UserNavigation | null;
  assistantWorkers: UserNavigation[] | null;
  membershipTypes: MembershipTypeNavigation[];
}

export interface ActivitiesNavigation {
  id: number;
  name: string;
  type: string;
  date: Date;
  hourStart: string;
  hourEnd: string;
  user: UserNavigation;
  cost: number;
  isActive: boolean;
}

export interface WorkingDayNavigation {
  id: number;
  dayOfWeek: string;
}

export interface DatetimeScheduledActivityNavigation {
  hourStart: string;
  hourEnd: string;
  workingDay: WorkingDayNavigation;
}

export interface ScheduledActivityNavigation {
  id: number;
  clubId: number;
  membershipTypes: MembershipTypeNavigation[];
  responsibleWorker: UserNavigation;
  assistantWorkers: UserNavigation[];
  datetimeScheduledActivities: DatetimeScheduledActivityNavigation[];
}

export interface IFacilitiesRepository {
  create(
    createFacilityDto: CreateFacilityDto,
    clubId: number,
  ): Promise<FacilityResponseDto>;
  findAll(clubId: number): Promise<FacilityResponseDto[]>;
  findById(
    query: QueryFacilitiesRequestDto,
  ): Promise<FacilityResponseDto | null>;
  update(
    query: QueryFacilitiesRequestDto,
    updateFacilityDto: UpdateFacilityDto,
  ): Promise<FacilityResponseDto>;
  delete(query: QueryFacilitiesRequestDto): Promise<void>;
}
