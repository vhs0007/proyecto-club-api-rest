import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  IExpirationRepository,
  ExpirationResponse,
  UserNavigation,
  MembershipNavigation,
} from './expiration.repository';
import { CreateExpirationDto } from '../dto/request/create-expiration.dto';
import { UpdateExpirationDto } from '../dto/request/update-expiration.dto';

type UserFromPrisma = {
  id: number;
  name: string;
  typeId: number;
  email: string | null;
  password: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
};

type MembershipFromPrisma = {
  id: number;
  typeId: number;
  userId: number;
};

@Injectable()
export class ExpirationRepository implements IExpirationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get expirations() {
    return this.prisma.expirations;
  }

  private userPrismaToInterface(user: UserFromPrisma): UserNavigation {
    return {
      id: user.id,
      name: user.name,
      typeId: user.typeId,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      isActive: user.isActive,
    };
  }

  private membershipPrismaToInterface(membership: MembershipFromPrisma): MembershipNavigation {
    return {
      id: membership.id,
      typeId: membership.typeId,
      userId: membership.userId,
    };
  }

  async create(createExpirationDto: CreateExpirationDto): Promise<ExpirationResponse> {
    const created = await this.expirations.create({
      data: {
        expirationDate: createExpirationDto.expirationDate,
        membershipId: createExpirationDto.membershipId,
      },
      include: { membership: { include: { user: true } } },
    });
    return {
      id: Number(created.id),
      expirationDate: created.expirationDate,
      member: this.userPrismaToInterface(created.membership.user),
      membership: this.membershipPrismaToInterface(created.membership),
    };
  }

  async findAll(): Promise<ExpirationResponse[]> {
    const list = await this.expirations.findMany({
      include: { membership: { include: { user: true } } },
    });
    return list.map((row) => ({
      id: row.id,
      expirationDate: row.expirationDate,
      member: this.userPrismaToInterface(row.membership.user),
      membership: this.membershipPrismaToInterface(row.membership),
    }));
  }

  async findById(id: number): Promise<ExpirationResponse | null> {
    const row = await this.expirations.findUnique({
      where: { id },
      include: { membership: { include: { user: true } } },
    });
    if (!row) return null;
    return {
      id: row.id,
      expirationDate: row.expirationDate,
      member: this.userPrismaToInterface(row.membership.user),
      membership: this.membershipPrismaToInterface(row.membership),
    };
  }

  async update(id: number, updateExpirationDto: UpdateExpirationDto): Promise<ExpirationResponse> {
    const data: { expirationDate?: Date; membershipId?: number } = {};
    if (updateExpirationDto.expirationDate !== undefined) data.expirationDate = updateExpirationDto.expirationDate;
    if (updateExpirationDto.membershipId !== undefined) data.membershipId = updateExpirationDto.membershipId;

    const updated = await this.expirations.update({
      where: { id },
      data,
      include: { membership: { include: { user: true } } },
    });
    return {
      id: updated.id,
      expirationDate: updated.expirationDate,
      member: this.userPrismaToInterface(updated.membership.user),
      membership: this.membershipPrismaToInterface(updated.membership),
    };
  }

  async delete(id: number): Promise<void> {
    await this.expirations.delete({ where: { id } });
  }
}
