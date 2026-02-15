export class User {
  id: number;
  name: string;
  createdAt: Date;
  email: string | null;
  password: string | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  isActive: boolean;
}
