import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './entities/membership.entity';
import { MembershipRepository } from './repository/membership.repository.impl';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    const user = await this.prisma.users.findUnique({ where: { id: createMembershipDto.userId } });
    if (!user) throw new BadRequestException('User not found');
    const membershipType = await this.prisma.membershipType.findUnique({ where: { id: createMembershipDto.type } });
    if (!membershipType) throw new BadRequestException('Membership type not found');
    const res = await this.membershipRepository.create(createMembershipDto);
    return new Membership({ id: res.id, type: res.type });
  }

  async findAll(): Promise<Membership[]> {
    const list = await this.membershipRepository.findAll();
    return list.map((r) => new Membership({ id: r.id, type: r.type }));
  }

  async findOne(id: number): Promise<Membership> {
    const row = await this.membershipRepository.findById(id);
    if (!row) throw new NotFoundException('Membership not found');
    return new Membership({ id: row.id, type: row.type });
  }

  async update(id: number, updateMembershipDto: UpdateMembershipDto): Promise<Membership> {
    const row = await this.membershipRepository.findById(id);
    if (!row) throw new NotFoundException('Membership not found');
    if (updateMembershipDto.userId !== undefined) {
      const user = await this.prisma.users.findUnique({ where: { id: updateMembershipDto.userId } });
      if (!user) throw new BadRequestException('User not found');
    }
    if (updateMembershipDto.type !== undefined) {
      const membershipType = await this.prisma.membershipType.findUnique({ where: { id: updateMembershipDto.type } });
      if (!membershipType) throw new BadRequestException('Membership type not found');
    }
    const updated = await this.membershipRepository.update(id, updateMembershipDto);
    return new Membership({ id: updated.id, type: updated.type });
  }

  async remove(id: number): Promise<Membership> {
    const row = await this.membershipRepository.findById(id);
    if (!row) throw new NotFoundException('Membership not found');
    await this.membershipRepository.delete(id);
    return new Membership({ id: row.id, type: row.type });
  }
}
