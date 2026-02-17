import { CreateActivitiesDto } from './create-activities.dto';

export interface UpdateActivitiesDto extends Partial<CreateActivitiesDto> {
  type: string;
  id: number;
  name?: string;
  startAt?: Date;
  endAt?: Date;
  userId?: number;
  cost?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
