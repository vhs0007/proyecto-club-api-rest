import { QueryMembershipTypeRequestDto } from "../dto/request/query-membership_type.request.dto";

export interface MembershipTypeResponse {
  id: number;
  name: string;
  price: number;
}

export interface UpdateMembershipTypeData {
  name?: string;
  price?: number;
}

export interface IMembershipTypeRepository {
  findAll(clubId: number): Promise<MembershipTypeResponse[]>;
  findById(queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto): Promise<MembershipTypeResponse | null>;
  create(data: { name: string; price: number; clubId: number }): Promise<MembershipTypeResponse>;
  update(queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto, data: UpdateMembershipTypeData): Promise<MembershipTypeResponse>;
  delete(queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto): Promise<void>;
}
