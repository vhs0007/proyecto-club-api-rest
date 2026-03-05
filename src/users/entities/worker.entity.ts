import { User, UserType } from './user.entity';

export class Worker extends User {
  override readonly type: UserType = UserType.WORKER;
  role: WorkerRole;
  salary: number;
  hoursToWorkPerDay: number | null;
  startWorkAt: Date;
  endWorkAt: Date;

  constructor(data: Partial<Worker>) {
    super(data);
    Object.assign(this, data);
  }
}

export enum WorkerRole {
    ADMIN = 1,
    COACH = 2,
    NUTRITIONIST = 3,
    PSYCHOLOGIST = 4,
    PHYSICAL_THERAPIST = 5,
    ADMINISTRATIVE = 6,
    CLEANER = 7,
}