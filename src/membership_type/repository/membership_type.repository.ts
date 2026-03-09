import { CreateMembershipTypeDto } from "../dto/create-membership_type.dto";
import { MembershipType } from "../entities/membership_type.entity";

export interface IMembershipTypeRepository {
  //create(createMembershipTypeDto: CreateMembershipTypeDto): Promise<MembershipType>;
  findAll(): Promise<MembershipType[]>;
  findById(id: number): Promise<MembershipType | null>;
  update(id: number, updateMembershipTypeDto: MembershipType): Promise<MembershipType>;
  delete(id: number): Promise<void>;
}