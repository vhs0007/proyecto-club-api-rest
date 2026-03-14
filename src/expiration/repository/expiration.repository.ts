import { CreateExpirationDto } from '../dto/request/create-expiration.dto';
import { UpdateExpirationDto } from '../dto/request/update-expiration.dto';

export interface UserNavigation {
  id: number;
  name: string;
  typeId: number;
  email: string | null;
  password: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
}

export interface MembershipNavigation {
  id: number;
  typeId: number;
  userId: number;
}

/** Datos planos que devuelve el repo (member y membership mapeados) */
export type ExpirationResponse = {
  id: number;
  expirationDate: Date;
  member: UserNavigation;
  membership: MembershipNavigation;
};

export interface IExpirationRepository {
  create(createExpirationDto: CreateExpirationDto): Promise<ExpirationResponse>;
  findAll(): Promise<ExpirationResponse[]>;
  findById(id: number): Promise<ExpirationResponse | null>;
  update(id: number, updateExpirationDto: UpdateExpirationDto): Promise<ExpirationResponse>;
  delete(id: number): Promise<void>;
}
