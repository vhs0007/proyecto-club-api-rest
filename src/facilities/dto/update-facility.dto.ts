import { CreateFacilityDto } from './create-facility.dto';

export interface UpdateFacilityDto extends Partial<CreateFacilityDto> {
  type?: string;
  capacity?: number;
  responsibleWorker?: number;
  assistantWorker?: number;
  isActive?: boolean;
  membershipIds?: number[];
}

