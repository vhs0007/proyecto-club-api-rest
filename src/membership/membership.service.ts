import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './entities/membership.entity';
import { MembershipRepository } from './repository/membership.repository.impl';

@Injectable()
export class MembershipService {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    const res = await this.membershipRepository.create(createMembershipDto);
    return new Membership({ id: res.id, type: res.type, price: res.price });
  }

  async findAll(): Promise<Membership[]> {
    const list = await this.membershipRepository.findAll();
    return list.map((r) => new Membership({ id: r.id, type: r.type, price: r.price }));
  }

  async findOne(id: number): Promise<Membership | null> {
    const row = await this.membershipRepository.findById(id);
    if (!row) return null;
    return new Membership({ id: row.id, type: row.type, price: row.price });
  }

  async update(id: number, updateMembershipDto: UpdateMembershipDto): Promise<Membership> {
    const row = await this.membershipRepository.findById(id);
    if (!row) throw new NotFoundException('Membership not found');
    const updated = await this.membershipRepository.update(id, updateMembershipDto);
    return new Membership({ id: updated.id, type: updated.type, price: updated.price });
  }

  async remove(id: number): Promise<Membership> {
    const row = await this.membershipRepository.findById(id);
    if (!row) throw new NotFoundException('Membership not found');
    await this.membershipRepository.delete(id);
    return new Membership({ id: row.id, type: row.type, price: row.price });
  }
}
