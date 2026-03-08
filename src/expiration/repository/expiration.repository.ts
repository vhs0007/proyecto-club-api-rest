import { CreateExpirationDto } from '../dto/create-expiration.dto';
import { UpdateExpirationDto } from '../dto/update-expiration.dto';

export type ExpirationResponse = CreateExpirationDto & { id: number };

export interface IExpirationRepository {
  create(createExpirationDto: CreateExpirationDto): Promise<ExpirationResponse>;
  findAll(): Promise<ExpirationResponse[]>;
  findById(id: number): Promise<ExpirationResponse | null>;
  update(id: number, updateExpirationDto: UpdateExpirationDto): Promise<ExpirationResponse>;
  delete(id: number): Promise<void>;
}
