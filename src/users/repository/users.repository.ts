import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface UserResponse {
  id: number;
  name: string;
  typeId: number;
  email: string | null;
  password: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
  roleId: number;
  salary: number | null;
  hoursToWorkPerDay: number | null;
  startWorkAt: Date | null;
  endWorkAt: Date | null;
  weight: number | null;
  height: number | null;
  gender: string | null;
  birthDate: Date | null;
  diet: string | null;
  trainingPlan: string | null;
  medicalHistory: string | null;
  allergies: string | null;
  medications: string | null;
  medicalConditions: string | null;
}

export interface IUsersRepository {
  create(createUserDto: CreateUserDto): Promise<UserResponse>;
  findAll(): Promise<UserResponse[]>;
  findById(id: number): Promise<UserResponse | null>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponse>;
  delete(id: number): Promise<void>;
}
