export interface CreateUserDto {
  id?: number;
  name: string;
  typeId: number;
  email?: string | null;
  password?: string | null;
  createdAt?: Date;
  deletedAt?: Date | null;
  isActive: boolean;
  membershipId?: number | null;
  roleId: number;
  salary?: number | null;
  hoursToWorkPerDay?: number | null;
  startWorkAt?: Date | null;
  endWorkAt?: Date | null;
  weight?: number | null;
  height?: number | null;
  gender?: string | null;
  birthDate?: Date | null;
  diet?: string | null;
  trainingPlan?: string | null;
  medicalHistory?: string | null;
  allergies?: string | null;
  medications?: string | null;
  medicalConditions?: string | null;
}
