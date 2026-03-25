export interface UserTypeResponse {
  id: number;
  name: string;
  clubId: number;
}

export interface UpdateUserTypeData {
  name?: string;
  clubId?: number;
}

export interface IUserTypeRepository {
  findAll(clubId: number): Promise<UserTypeResponse[]>;
  findById(id: number): Promise<UserTypeResponse | null>;
  create(data: { name: string, clubId: number }): Promise<UserTypeResponse>;
  // update(id: number, data: UpdateUserTypeData): Promise<UserTypeResponse>;
  // delete(id: number): Promise<void>;
}
