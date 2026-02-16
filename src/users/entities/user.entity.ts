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
  WORKER = 'worker',
  ATHLETE = 'athlete',
  MEMBER = 'member',
}
