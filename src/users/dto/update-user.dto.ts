import { Gender } from '../entities/athlete.entity';
import { MemberRole } from '../entities/member.entity';
import { WorkerRole } from '../entities/worker.entity';
import { CreateUserDto } from './create-user.dto';
import { UserType } from '../entities/user.entity';

export interface UpdateUserDto extends Partial<CreateUserDto> {
  type: UserType;
  id: number;
  name?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  isActive?: boolean;
  diet?: string;
  trainingPlan?: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  medicalConditions?: string;
}
