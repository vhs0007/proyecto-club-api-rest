import { CreateExpirationDto } from '../dto/create-expiration.dto';
import { UpdateExpirationDto } from '../dto/update-expiration.dto';

export type ExpirationResponse = CreateExpirationDto & { id: number };

export interface IFacilitiesRepository {
  create(createFacilityDto: CreateFacilityDto): Promise<FacilityResponse>;
  findAll(): Promise<FacilityResponse[]>;
  findById(id: number): Promise<FacilityResponse | null>;
  update(id: number, updateFacilityDto: UpdateFacilityDto): Promise<FacilityResponse>;
  delete(id: number): Promise<void>;
}