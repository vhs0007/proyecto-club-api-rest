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
  findAll(): Promise<MembershipTypeResponse[]>;
  findById(id: number): Promise<MembershipTypeResponse | null>;
  // create(data: { name: string; price: number }): Promise<MembershipTypeResponse>;
  // update(id: number, data: UpdateMembershipTypeData): Promise<MembershipTypeResponse>;
  // delete(id: number): Promise<void>;
}
