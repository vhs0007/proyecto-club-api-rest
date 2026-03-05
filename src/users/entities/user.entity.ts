export abstract class User {
  id: number;
  name: string;
  type: UserType;
  createdAt: Date;
  email: string | null;
  password: string | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  isActive: boolean;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

}

export enum UserType {
  WORKER = 1,
  ATHLETE = 2,
  MEMBER = 3,
}
