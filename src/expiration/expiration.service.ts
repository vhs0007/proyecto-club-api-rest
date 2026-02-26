import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpirationDto } from './dto/create-expiration.dto';
import { UpdateExpirationDto } from './dto/update-expiration.dto';
import { Expiration } from './entities/expiration.entity';

@Injectable()
export class ExpirationService {
  expirations: Expiration[] = [];

  create(createExpirationDto: CreateExpirationDto) {
    const id_expiration =
      Math.max(0, ...this.expirations.map((e) => e.id_expiration)) + 1;
    const expiration = new Expiration({
      ...createExpirationDto,
      id_expiration,
    });
    this.expirations.push(expiration);
    return expiration;
  }

  findAll() {
    return this.expirations;
  }

  findOne(id: number) {
    return this.expirations.find((e) => e.id_expiration === id);
  }

  update(id: number, updateExpirationDto: UpdateExpirationDto) {
    const expiration = this.expirations.find((e) => e.id_expiration === id);
    if (!expiration) {
      throw new NotFoundException('Expiration not found');
    }
    Object.assign(expiration, updateExpirationDto);
    return expiration;
  }

  remove(id: number) {
    const expiration = this.expirations.find((e) => e.id_expiration === id);
    if (!expiration) {
      throw new NotFoundException('Expiration not found');
    }
    this.expirations = this.expirations.filter((e) => e.id_expiration !== id);
    return expiration;
  }
}
