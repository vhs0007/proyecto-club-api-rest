export class Activity {
    id: number;
    name: string;
    type: string;
    startAt: Date;
    endAt: Date;
    userId: number;
    cost: number;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    isActive: boolean;
  
  constructor(data: Partial<Activity>) {
    Object.assign(this, data);
  }
}