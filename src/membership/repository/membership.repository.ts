import { CreateMembershipDto } from '../dto/request/create-membership.dto';
import { QueryMembershipRequestDto } from '../dto/request/query-membership.request.dto';
import { UpdateMembershipDto } from '../dto/request/update-membership.dto';
import { Prisma } from '@prisma/client';
import { MembershipResponseDto } from '../dto/response/membership-response.dto';

export interface userNavigation {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  isActive: boolean;
  type: { id: number; name: string };
}

export interface membershipTypeNavigation {
  id: number;
  name: string;
  price: Prisma.Decimal;
}

export interface IMembershipRepository {
  create(
    createMembershipDto: CreateMembershipDto,
  ): Promise<MembershipResponseDto>;
  findAll(clubId: number): Promise<MembershipResponseDto[]>;
  findById(
    queryMembershipRequestDto: QueryMembershipRequestDto,
  ): Promise<MembershipResponseDto | null>;
  update(
    queryMembershipRequestDto: QueryMembershipRequestDto,
    updateMembershipDto: UpdateMembershipDto,
  ): Promise<MembershipResponseDto>;
  delete(queryMembershipRequestDto: QueryMembershipRequestDto): Promise<void>;
}
