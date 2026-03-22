import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMembershipDto } from './dto/request/create-membership.dto';
import { UpdateMembershipDto } from './dto/request/update-membership.dto';
import { MembershipRepository } from './repository/membership.repository.impl';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipResponseDto } from './dto/response/membership-response.dto';
import { MembershipResponse } from './repository/membership.repository';


@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly prisma: PrismaService,
  ) {}

  private fromPrismaToResponse(row: MembershipResponse): MembershipResponseDto {
    return {
      id: row.id,
      user: row.user,
      membershipType: row.type,
      expiration: row.expiration,
    }
  }

  async create(createMembershipDto: CreateMembershipDto): Promise<MembershipResponseDto> {
    const user = await this.prisma.users.findUnique({ where: { id: createMembershipDto.userId } });
    if (!user) throw new BadRequestException('User not found');
    const membershipType = await this.prisma.membership_type.findUnique({ where: { id: createMembershipDto.type } });
    if (!membershipType) throw new BadRequestException('Membership type not found');
    const res = await this.membershipRepository.create(createMembershipDto);
    return this.fromPrismaToResponse(res);
  }

  async findAll(): Promise<MembershipResponseDto[]> {
    const list = await this.membershipRepository.findAll();
    return list.map((r) => this.fromPrismaToResponse(r));
  }

  async findOne(id: number): Promise<MembershipResponseDto> {
    const row = await this.membershipRepository.findById(id);
    if (!row) throw new NotFoundException('Membership not found');
    return this.fromPrismaToResponse(row);
  }

  async update(id: number, updateMembershipDto: UpdateMembershipDto): Promise<MembershipResponseDto> {
    const row = await this.membershipRepository.findById(id);
    if (!row) throw new NotFoundException('Membership not found');
    if (updateMembershipDto.userId !== undefined) {
      const user = await this.prisma.users.findUnique({ where: { id: updateMembershipDto.userId } });
      if (!user) throw new BadRequestException('User not found');
    }
    if (updateMembershipDto.type !== undefined) {
      const membershipType = await this.prisma.membership_type.findUnique({ where: { id: updateMembershipDto.type } });
      if (!membershipType) throw new BadRequestException('Membership type not found');
    }
    const updated = await this.membershipRepository.update(id, updateMembershipDto);
    return this.fromPrismaToResponse(updated);
  }

  async remove(id: number): Promise<MembershipResponseDto> {
    const row = await this.membershipRepository.findById(id);
    if (!row) throw new NotFoundException('Membership not found');
    await this.membershipRepository.delete(id);
    return this.fromPrismaToResponse(row);
  }
}
