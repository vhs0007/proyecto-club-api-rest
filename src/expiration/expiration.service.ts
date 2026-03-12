import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpirationDto } from './dto/create-expiration.dto';
import { UpdateExpirationDto } from './dto/update-expiration.dto';
import { Expiration } from './entities/expiration.entity';
import { ExpirationRepository } from './repository/expiration.repository.impl';
import type { ExpirationResponse } from './repository/expiration.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpirationService {
  constructor(
    private readonly expirationRepository: ExpirationRepository,
    private readonly prisma: PrismaService,
  ) {}

  private mapResponseToExpiration(res: ExpirationResponse): Expiration {
    return new Expiration({
      id: res.id,
      expirationDate: res.expirationDate,
      member: { id: res.memberId } as Expiration['member'],
      membership: { id: res.membershipId } as Expiration['membership'],
    });
  }

  async create(createExpirationDto: CreateExpirationDto): Promise<Expiration> {
    const membership = await this.prisma.membership.findUnique({ where: { id: createExpirationDto.membershipId } });
    if (!membership) throw new BadRequestException('Membership not found');
    const res = await this.expirationRepository.create(createExpirationDto);
    return this.mapResponseToExpiration(res);
  }

  async findAll(): Promise<Expiration[]> {
    const list = await this.expirationRepository.findAll();
    return list.map((r) => this.mapResponseToExpiration(r));
  }

  async findOne(id: number): Promise<Expiration> {
    const row = await this.expirationRepository.findById(id);
    if (!row) throw new NotFoundException('Expiration not found');
    return this.mapResponseToExpiration(row);
  }

  async update(id: number, updateExpirationDto: UpdateExpirationDto): Promise<Expiration> {
    const row = await this.expirationRepository.findById(id);
    if (!row) throw new NotFoundException('Expiration not found');
    if (updateExpirationDto.membershipId !== undefined) {
      const membership = await this.prisma.membership.findUnique({ where: { id: updateExpirationDto.membershipId } });
      if (!membership) throw new BadRequestException('Membership not found');
    }
    const updated = await this.expirationRepository.update(id, updateExpirationDto);
    return this.mapResponseToExpiration(updated);
  }

  async remove(id: number): Promise<Expiration> {
    const row = await this.expirationRepository.findById(id);
    if (!row) throw new NotFoundException('Expiration not found');
    await this.expirationRepository.delete(id);
    return this.mapResponseToExpiration(row);
  }
}
