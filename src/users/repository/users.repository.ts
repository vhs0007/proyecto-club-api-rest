import { CreateUserDto } from '../dto/request/create-user.request.dto';
import { UpdateUserDto } from '../dto/request/update-user.request.dto';
import { UserTypeResponseDto } from '../../user_type/dto/user-type-response.dto';

export interface UserResponse {
  id: number;
  name: string;
  typeId: number;
  type?: UserTypeResponseDto;
  email: string | null;
  password: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
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
  findByEmail(email: string): Promise<UserResponse | null>;
  existsTypeId(typeId: number): Promise<boolean>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponse>;
  delete(id: number): Promise<void>;
}
