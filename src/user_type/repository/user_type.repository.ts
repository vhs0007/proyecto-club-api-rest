import { UserTypeResponseDto } from '../dto/response/user-type-response.dto';

export interface IUserTypeRepository {
  findAll(): Promise<UserTypeResponseDto[]>;
  findById(id: number): Promise<UserTypeResponseDto | null>;
  create(data: { name: string }): Promise<UserTypeResponseDto>;
  // update(id: number, data: UpdateUserTypeData): Promise<UserTypeResponse>;
  // delete(id: number): Promise<void>;
}
