import { CreateMembershipDto } from '../dto/request/create-membership.dto';
import { QueryMembershipRequestDto } from '../dto/request/query-membership.request.dto';
import { UpdateMembershipDto } from '../dto/request/update-membership.dto';
import { Prisma } from '@prisma/client';

export type MembershipResponse = {
  id: number;
  type: membershipTypeNavigation;
  user: userNavigation;
  expiration: Date;
  createdAt: Date;
};

export interface userNavigation{
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  isActive: boolean;
  type: {id: number; name: string;};
}

export interface membershipTypeNavigation{
  id: number;
  name: string;
  price: Prisma.Decimal;
}

export interface IMembershipRepository {
  create(createMembershipDto: CreateMembershipDto): Promise<MembershipResponse>;
  findAll(clubId: number): Promise<MembershipResponse[]>;
  findById(queryMembershipRequestDto: QueryMembershipRequestDto): Promise<MembershipResponse | null>;
  update(queryMembershipRequestDto: QueryMembershipRequestDto, updateMembershipDto: UpdateMembershipDto): Promise<MembershipResponse>;
  delete(queryMembershipRequestDto: QueryMembershipRequestDto): Promise<void>;
}
