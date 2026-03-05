import { Gender } from '../entities/athlete.entity';
import { CreateUserDto } from './create-user.dto';

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: number;
  name?: string;
  email?: string | null;
  password?: string | null;
  salary?: number | null;
  hoursToWorkPerDay?: number;
  startWorkAt?: Date;
  endWorkAt?: Date;
  weight?: number;
  height?: number;
  gender?: Gender;
  birthDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  isActive?: boolean;
  diet?: string;
  trainingPlan?: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  medicalConditions?: string;
  typeId?: number;
  roleId?: number;
  membershipId?: number | null;
}
