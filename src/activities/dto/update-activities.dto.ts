import { CreateActivityDto } from './create-activities.dto';

export interface UpdateActivityDto extends Partial<CreateActivityDto> {
  type: string;
  id: number;
  name?: string;
  startAt?: Date;
  endAt?: Date;
  userId?: number;
  cost?: number;
  facility?: CreateActivityDto['facility'];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
