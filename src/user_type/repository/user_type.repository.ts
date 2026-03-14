export interface UserTypeResponse {
  id: number;
  name: string;
}

export interface UpdateUserTypeData {
  name?: string;
}

export interface IUserTypeRepository {
  findAll(): Promise<UserTypeResponse[]>;
  findById(id: number): Promise<UserTypeResponse | null>;
  // create(data: { name: string }): Promise<UserTypeResponse>;
  // update(id: number, data: UpdateUserTypeData): Promise<UserTypeResponse>;
  // delete(id: number): Promise<void>;
}
