import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpirationDto } from './dto/create-expiration.dto';
import { UpdateExpirationDto } from './dto/update-expiration.dto';
import type { ExpirationResponseDto } from './dto/expiration-response.dto';
import { ExpirationRepository } from './repository/expiration.repository.impl';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpirationService {
  constructor(
    private readonly expirationRepository: ExpirationRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createExpirationDto: CreateExpirationDto): Promise<ExpirationResponseDto> {
    const membership = await this.prisma.membership.findUnique({ where: { id: createExpirationDto.membershipId } });
    if (!membership) throw new BadRequestException('Membership not found');
    return this.expirationRepository.create(createExpirationDto);
  }

  async findAll(): Promise<ExpirationResponseDto[]> {
    return this.expirationRepository.findAll();
  }

  async findOne(id: number): Promise<ExpirationResponseDto> {
    const row = await this.expirationRepository.findById(id);
    if (!row) throw new NotFoundException('Expiration not found');
    return row;
  }

  async update(id: number, updateExpirationDto: UpdateExpirationDto): Promise<ExpirationResponseDto> {
    const row = await this.expirationRepository.findById(id);
    if (!row) throw new NotFoundException('Expiration not found');
    if (updateExpirationDto.membershipId !== undefined) {
      const membership = await this.prisma.membership.findUnique({ where: { id: updateExpirationDto.membershipId } });
      if (!membership) throw new BadRequestException('Membership not found');
    }
    return this.expirationRepository.update(id, updateExpirationDto);
  }

  async remove(id: number): Promise<ExpirationResponseDto> {
    const row = await this.expirationRepository.findById(id);
    if (!row) throw new NotFoundException('Expiration not found');
    await this.expirationRepository.delete(id);
    return row;
  }
}
