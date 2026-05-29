import { CreateUserDto } from '../dto/request/create-user.request.dto';
import { UpdateUserDto } from '../dto/request/update-user.request.dto';
import { MembershipTypeResponseDto } from 'src/membership_type/dto/response/membership_type-response.dto';
import { QueryUserRequestDto } from '../dto/request/query-user.request.dto';
import { UserResponseDto } from '../dto/response/user.response.dto';

export interface membershipNavigation {
  id: number;
  expiration: Date;
  createdAt: Date;
  membershipType: MembershipTypeResponseDto;
}

export interface WorkingDayNavigation {
  id: number;
  dayOfWeek: string;
}

export interface MembershipTypeNavigation {
  id: number;
  name: string;
  price: number;
}

export interface UserTypeNavigation {
  id: number;
  name: string;
}

export interface UserNavigation {
  id: number;
  name: string;
  type: UserTypeNavigation;
  email: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
}

export interface DatetimeScheduledActivityNavigation {
  hourStart: string;
  hourEnd: string;
  workingDay: WorkingDayNavigation;
}

export interface ScheduledActivityNavigation {
  id: number;
  clubId: number;
  membershipTypes: MembershipTypeNavigation[];
  responsibleWorker: UserNavigation;
  assistantWorkers: UserNavigation[];
  datetimeScheduledActivities: DatetimeScheduledActivityNavigation[];
}

export interface IUsersRepository {
  create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
  findAll(clubId: number): Promise<UserResponseDto[]>;
  findById(
    queryUserRequestDto: QueryUserRequestDto,
  ): Promise<UserResponseDto | null>;
  findByEmail(email: string, clubId: number): Promise<UserResponseDto | null>;
  findByDocument(
    document: string,
    clubId: number,
  ): Promise<UserResponseDto | null>;
  existsTypeId(typeId: number): Promise<boolean>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
  delete(queryUserRequestDto: QueryUserRequestDto): Promise<void>;
}
