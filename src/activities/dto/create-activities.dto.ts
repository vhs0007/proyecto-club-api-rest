import { Facility } from '../../facilities/entities/facility.entity';

export interface CreateActivityDto {
  name: string;
  type: string;
  startAt: Date;
  endAt: Date;
  userId: number;
  cost: number;
  facility: Facility;
  isActive?: boolean;
  createdAt?: Date;
}
