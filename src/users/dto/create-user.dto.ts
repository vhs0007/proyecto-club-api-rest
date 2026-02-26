import type { MemberRole } from "../entities/member.entity";
import type { WorkerRole } from "../entities/worker.entity";
import type { Gender } from "../entities/athlete.entity";
import type { UserType } from "../entities/user.entity";
import type { MembershipType } from "../../membership/entities/membership.entity";

export interface CreateUserDto {
  name: string;
  type: UserType;
  email?: string;
  password?: string;
  createdAt?: Date;
  deletedAt?: Date;
  isActive?: boolean;
  membership?: MembershipType;
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
