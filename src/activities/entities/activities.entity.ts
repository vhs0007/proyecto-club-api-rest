export abstract class Activities {
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
  
    constructor(data: Partial<Activities>) {
      Object.assign(this, data);
    }
  }