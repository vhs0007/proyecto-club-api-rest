import { Facility } from 'src/facilities/entities/facility.entity';

export class Activity {
  id: number;
  name: string;
  type: string;
  startAt: Date;
  endAt: Date;
  userId: number;
  cost: number;
  facility: Facility;
  isActive: boolean;

  constructor(data: Partial<Activity>) {
    Object.assign(this, data);
  }
}