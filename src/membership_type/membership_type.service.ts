import { Injectable, NotFoundException } from '@nestjs/common';
import { MembershipTypeRepository } from './repository/membership_type.repository.impl';
import type { MembershipTypeResponseDto } from './dto/response/membership_type-response.dto';

@Injectable()
export class MembershipTypeService {
  constructor(private readonly membershipTypeRepository: MembershipTypeRepository) {}

  async findAll(): Promise<MembershipTypeResponseDto[]> {
    return this.membershipTypeRepository.findAll();
  }

  // async create(dto: CreateMembershipTypeDto): Promise<MembershipTypeResponseDto> {
  //   return this.membershipTypeRepository.create({ name: dto.name, price: dto.price });
  // }

  async findOne(id: number): Promise<MembershipTypeResponseDto> {
    const row = await this.membershipTypeRepository.findById(id);
    if (!row) throw new NotFoundException('Membership type not found');
    return row;
  }

  // async update(id: number, updateMembershipTypeDto: UpdateMembershipTypeDto): Promise<MembershipType> {
  //   const res = await this.membershipTypeRepository.update(id, updateMembershipTypeDto);
  //   return this.mapResponseToMembershipType(res);
  // }

  // async remove(id: number): Promise<void> {
  //   await this.membershipTypeRepository.delete(id);
  // }
}
