import { CreateUserDto } from '../dto/request/create-user.request.dto';
import { UpdateUserDto } from '../dto/request/update-user.request.dto';
<<<<<<< Updated upstream
import { MembershipTypeResponseDto } from 'src/membership_type/dto/response/membership_type-response.dto';
import { QueryUserRequestDto } from '../dto/request/query-user.request.dto';
import { UserResponseDto } from '../dto/response/user.response.dto';
=======
import { UserTypeResponseDto } from '../../user_type/dto/response/user-type-response.dto';
import { MembershipTypeResponseDto } from 'src/membership_type/dto/response/membership_type-response.dto';
>>>>>>> Stashed changes

export interface membershipNavigation {
  id: number;
<<<<<<< Updated upstream
  expiration: Date;
=======
  name: string;
  typeId: number;
  type?: UserTypeResponseDto;
  email: string | null;
  password: string | null;
  membership?: membershipNavigation | null;
>>>>>>> Stashed changes
  createdAt: Date;
  membershipType: MembershipTypeResponseDto;
}

export interface membershipNavigation{
  id: number;
  expiration: Date;
  createdAt: Date;
  membershipType: MembershipTypeResponseDto;
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
