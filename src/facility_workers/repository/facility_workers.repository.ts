import { CreateFacilityWorkerDto } from "../dto/request/create-facility_worker.dto";
import { UpdateFacilityWorkerDto } from "../dto/request/update-facility_worker.dto";
import { FacilityWorkerResponseDto } from "../dto/response/facility_worker.response.dto";

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

export interface IFacilityWorkersRepository {
    create(createFacilityWorkerDto: CreateFacilityWorkerDto): Promise<FacilityWorkerResponseDto>;
    update(id: number, updateFacilityWorkerDto: UpdateFacilityWorkerDto): Promise<FacilityWorkerResponseDto>;
}