import { User } from "./user.entity";

export class Worker extends User {
  readonly kind = 'worker' as const;
  role: WorkerRole;
  salary: number;
  hoursToWorkPerDay: number | null;
  startWorkAt: Date;
  endWorkAt: Date;

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