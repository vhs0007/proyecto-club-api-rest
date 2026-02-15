import type { MemberRole } from "../entities/member.entity";
import type { WorkerRole } from "../entities/worker.entity";
import type { Gender } from "../entities/athlete.entity";

export interface CreateUserDto {
  name: string;
  email?: string;
  password?: string;
  role?: MemberRole | WorkerRole;
  salary?: number;
  hoursToWorkPerDay?: number;
  startWorkAt?: Date;
  endWorkAt?: Date;
  weight?: number;
  height?: number;
  gender?: Gender;
  birthDate?: Date;
  diet?: string;
  trainingPlan?: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  medicalConditions?: string;
}
