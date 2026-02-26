import { Membership } from "src/membership/entities/membership.entity";

export class Facility {
    id: number;
    type: string;
    capacity: number;
    responsibleWorker: number;
    assistantWorker: number | null;
    isActive: boolean;

    membership: Membership[];
    constructor(data: Partial<Facility>) {
      Object.assign(this, data);
    }
  }

