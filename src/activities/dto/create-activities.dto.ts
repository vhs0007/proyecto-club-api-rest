
export interface CreateActivitiesDto {
  name: string;
  type: string;
  startAt: Date;
  endAt: Date;
  userId: number;
  cost: number;
  isActive?: boolean;
  createdAt?: Date;
}
