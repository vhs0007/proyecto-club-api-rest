import { Injectable, NotFoundException } from '@nestjs/common';
import { MembershipTypeRepository } from './repository/membership_type.repository.impl';
import { MembershipType } from './entities/membership_type.entity';
import type { MembershipTypeResponse } from './repository/membership_type.repository';

@Injectable()
export class MembershipTypeService {
  constructor(private readonly membershipTypeRepository: MembershipTypeRepository) {}

  private mapResponseToMembershipType(res: MembershipTypeResponse): MembershipType {
    const m = new MembershipType();
    m.id = res.id;
    m.name = res.name;
    m.price = res.price;
    return m;
  }

  async findAll(): Promise<MembershipType[]> {
    const list = await this.membershipTypeRepository.findAll();
    return list.map((r) => this.mapResponseToMembershipType(r));
  }

  async findOne(id: number): Promise<MembershipType> {
    const row = await this.membershipTypeRepository.findById(id);
    if (!row) throw new NotFoundException('Membership type not found');
    return this.mapResponseToMembershipType(row);
  }

  // update(id: number, updateMembershipTypeDto: MembershipType) {
  //   return this.membershipTypeRepository.update(id, updateMembershipTypeDto);
  // }

  // remove(id: number) {
  //   return this.membershipTypeRepository.delete(id);
  // }
}
