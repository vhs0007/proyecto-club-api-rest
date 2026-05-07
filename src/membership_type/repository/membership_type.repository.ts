import { QueryMembershipTypeRequestDto } from '../dto/request/query-membership_type.request.dto';
import { MembershipTypeResponseDto } from '../dto/response/membership_type-response.dto';

export interface UpdateMembershipTypeData {
  name?: string;
  price?: number;
}

export interface IMembershipTypeRepository {
  findAll(clubId: number): Promise<MembershipTypeResponseDto[]>;
  findById(
    queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto,
  ): Promise<MembershipTypeResponseDto | null>;
  create(data: {
    name: string;
    price: number;
    clubId: number;
  }): Promise<MembershipTypeResponseDto>;
  update(
    queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto,
    data: UpdateMembershipTypeData,
  ): Promise<MembershipTypeResponseDto>;
  delete(
    queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto,
  ): Promise<void>;
}
