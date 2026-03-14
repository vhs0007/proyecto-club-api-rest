import { CreateFacilityDto } from '../dto/create-facility.dto';
import { UpdateFacilityDto } from '../dto/update-facility.dto';

export type FacilityResponse = CreateFacilityDto & { id: number };

export interface IFacilitiesRepository {
  create(createFacilityDto: CreateFacilityDto): Promise<FacilityResponse>;
  findAll(): Promise<FacilityResponse[]>;
  findById(id: number): Promise<FacilityResponse | null>;
  update(id: number, updateFacilityDto: UpdateFacilityDto): Promise<FacilityResponse>;
  delete(id: number): Promise<void>;
}