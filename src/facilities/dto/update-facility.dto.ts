import { CreateFacilityDto } from './create-facility.dto';
import { Membership } from 'src/membership/entities/membership.entity';

export interface UpdateFacilityDto extends Partial<CreateFacilityDto> {
  id: number;
  tipo?: string;
  capacity?: number;
  responsibleWorker?: number;
  assistantWorker?: number;
  isActive?: boolean;
  membership?: Membership[];
}

