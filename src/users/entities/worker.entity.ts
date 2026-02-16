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
    ADMIN = 'admin',
    COACH = 'coach',
    NUTRITIONIST = 'nutritionist',
    PSYCHOLOGIST = 'psychologist',
    PHYSICAL_THERAPIST = 'physical_therapist',
    ADMINISTRATIVE = 'administrative',
    CLEANER = 'cleaner',
}