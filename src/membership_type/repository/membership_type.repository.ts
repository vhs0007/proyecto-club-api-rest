export interface MembershipTypeResponse {
  id: number;
  name: string;
}

export interface IMembershipTypeRepository {
  findAll(): Promise<MembershipTypeResponse[]>;
  findById(id: number): Promise<MembershipTypeResponse | null>;
  // update(id: number, updateMembershipTypeDto: MembershipType): Promise<MembershipType>;
  // delete(id: number): Promise<void>;
}
