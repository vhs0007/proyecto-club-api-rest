
export interface CreateActivityDto {
  id?: number;
  name: string;
  type: string;
  startAt: Date;
  endAt: Date;
  userId: number;
  cost: number;
  facilityId: number;
  isActive?: boolean;
  createdAt?: Date;
}
