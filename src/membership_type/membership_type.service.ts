import { Injectable, NotFoundException } from '@nestjs/common';
import { MembershipTypeRepository } from './repository/membership_type.repository.impl';
import { MembershipType } from './entities/membership_type.entity';
import type { MembershipTypeResponse } from './repository/membership_type.repository';

@Injectable()
export class MembershipTypeService {
  constructor(private readonly membershipTypeRepository: MembershipTypeRepository) {}

  private mapResponseToMembershipType(res: MembershipTypeResponse): MembershipType {
    const m = new MembershipType({id: res.id, name: res.name, price: res.price});
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

  // async create(dto: { name: string; price: number }): Promise<MembershipType> {
  //   const res = await this.membershipTypeRepository.create(dto);
  //   return this.mapResponseToMembershipType(res);
  // }

  // async update(id: number, updateMembershipTypeDto: UpdateMembershipTypeDto): Promise<MembershipType> {
  //   const res = await this.membershipTypeRepository.update(id, updateMembershipTypeDto);
  //   return this.mapResponseToMembershipType(res);
  // }

  // async remove(id: number): Promise<void> {
  //   await this.membershipTypeRepository.delete(id);
  // }
}
