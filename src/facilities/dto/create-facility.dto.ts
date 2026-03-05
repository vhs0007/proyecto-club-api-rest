export interface CreateFacilityDto {
  id?: number;
  type: string;
  capacity: number;
  responsibleWorker: number;
  assistantWorker?: number | null;
  isActive?: boolean;
  membershipIds: number[];
}

