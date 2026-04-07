import { CreateUserDto } from '../dto/request/create-user.request.dto';
import { UpdateUserDto } from '../dto/request/update-user.request.dto';
import { UserTypeResponseDto } from '../../user_type/dto/response/user-type-response.dto';
import { MembershipTypeResponseDto } from 'src/membership_type/dto/response/membership_type-response.dto';
import { QueryUserRequestDto } from '../dto/request/query-user.request.dto';

export interface UserResponse {
  id: number;
  name: string;
  typeId: number;
  type?: UserTypeResponseDto;
  email: string | null;
  password: string | null;
  membership?: membershipNavigation[] | undefined;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
  salary: number | null;
  employmentStartDate: Date | null;
  hoursToWorkPerDay: number | null;
  startWorkAt: string | null;
  endWorkAt: string | null;
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

export interface membershipNavigation{
  id: number;
  expiration: Date;
  createdAt: Date;
  membershipType: MembershipTypeResponseDto;
}

export interface IUsersRepository {
  create(createUserDto: CreateUserDto): Promise<UserResponse>;
  findAll(clubId: number): Promise<UserResponse[]>;
  findById(queryUserRequestDto: QueryUserRequestDto): Promise<UserResponse | null>;
  findByEmail(email: string): Promise<UserResponse | null>;
  existsTypeId(typeId: number): Promise<boolean>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponse>;
  delete(queryUserRequestDto: QueryUserRequestDto): Promise<void>;
}
