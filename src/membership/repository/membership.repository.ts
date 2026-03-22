import { CreateMembershipDto } from '../dto/request/create-membership.dto';
import { UpdateMembershipDto } from '../dto/request/update-membership.dto';
import { Prisma } from '@prisma/client';

export type MembershipResponse = {
  id: number;
  type: membershipTypeNavigation;
  user: userNavigation;
  expiration: Date;
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
  findAll(): Promise<MembershipResponse[]>;
  findById(id: number): Promise<MembershipResponse | null>;
  update(id: number, updateMembershipDto: UpdateMembershipDto): Promise<MembershipResponse>;
  delete(id: number): Promise<void>;
}
