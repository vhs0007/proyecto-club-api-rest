import { FacilityNavigation } from 'src/activities/repository/activitities.repository';
import { CreateFacilityDto } from '../dto/request/create-facility.dto';
import { UpdateFacilityDto } from '../dto/request/update-facility.dto';

export interface UserTypeNavigation {
  id: number;
  name: string;
};
export interface WorkerNavigation {
  id: number;
  name: string;
  type: UserTypeNavigation;
  email: string | null;
  password: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
};

export interface UserNavigation {
  id: number;
  name: string;
  type: UserTypeNavigation;
  email: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
};
export interface ActivitiesNavigation {
  id: number;
  name: string;
  type: string;
  startAt: Date;
  endAt: Date;
  user: UserNavigation;
  cost: number;
  isActive: boolean;
};
export interface MembershipTypeNavigation {
  id: number;
  name: string;
  price: number;
}

export type FacilityResponse = {
  id: number;
  type: string;
  capacity: number;
  responsibleWorker: WorkerNavigation;
  assistantWorker: WorkerNavigation | null;
  isActive: boolean;
  activities: ActivitiesNavigation[];
  membershipTypes: MembershipTypeNavigation[];
};

export interface IFacilitiesRepository {
  create(createFacilityDto: CreateFacilityDto): Promise<FacilityResponse>;
  findAll(): Promise<FacilityResponse[]>;
  findById(id: number): Promise<FacilityResponse | null>;
  update(id: number, updateFacilityDto: UpdateFacilityDto): Promise<FacilityResponse>;
  delete(id: number): Promise<void>;
}