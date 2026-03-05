import { CreateMembershipDto } from '../dto/create-membership.dto';
import { UpdateMembershipDto } from '../dto/update-membership.dto';

export type MembershipResponse = {
  id: number;
  type: CreateMembershipDto['type'];
  price: number;
};

export interface IMembershipRepository {
  create(createMembershipDto: CreateMembershipDto): Promise<MembershipResponse>;
  findAll(): Promise<MembershipResponse[]>;
  findById(id: number): Promise<MembershipResponse | null>;
  update(id: number, updateMembershipDto: UpdateMembershipDto): Promise<MembershipResponse>;
  delete(id: number): Promise<void>;
}
