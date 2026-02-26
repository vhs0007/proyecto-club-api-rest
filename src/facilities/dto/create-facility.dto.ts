import { Membership } from "src/membership/entities/membership.entity";

export interface CreateFacilityDto {
  type: string;
  capacity: number;
  responsibleWorker: number;
  assistantWorker?: number;
  isActive?: boolean;
  membership: Membership[];
}

