import { FacilityNavigation } from 'src/activities/repository/activitities.repository';
import { CreateFacilityDto } from '../dto/request/create-facility.dto';
import { UpdateFacilityDto } from '../dto/request/update-facility.dto';


export interface WorkerNavigation {
  id: number;
  name: string;
  typeId: number;
  email: string | null;
  password: string | null;
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
  user: WorkerNavigation;
  cost: number;
  facility: FacilityNavigation;
  isActive: boolean;
};

export type FacilityResponse = {
  id: number;
  type: string;
  capacity: number;
  responsibleWorker: WorkerNavigation;
  assistantWorker: WorkerNavigation | null;
  isActive: boolean;
  membershipTypeIds: number[];
};

export interface IFacilitiesRepository {
  create(createFacilityDto: CreateFacilityDto): Promise<FacilityResponse>;
  findAll(): Promise<FacilityResponse[]>;
  findById(id: number): Promise<FacilityResponse | null>;
  update(id: number, updateFacilityDto: UpdateFacilityDto): Promise<FacilityResponse>;
  delete(id: number): Promise<void>;
}