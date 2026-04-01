import { Injectable, NotFoundException } from '@nestjs/common';
import { MembershipTypeRepository } from './repository/membership_type.repository.impl';
import type { MembershipTypeResponseDto } from './dto/response/membership_type-response.dto';
import type { CreateMembershipTypeDto } from './dto/request/create-membership_type.dto';
import type { UpdateMembershipTypeDto } from './dto/request/update-membership_type.dto';
import type { UpdateMembershipTypeData } from './repository/membership_type.repository';


@Injectable()
export class MembershipTypeService {
  constructor(private readonly membershipTypeRepository: MembershipTypeRepository) {}

  async findAll(clubId: number): Promise<MembershipTypeResponseDto[]> {
    return this.membershipTypeRepository.findAll(clubId);
  }

   async create(dto: CreateMembershipTypeDto): Promise<MembershipTypeResponseDto> {
     return this.membershipTypeRepository.create({ name: dto.name, price: dto.price, clubId: dto.clubId });
   }

  async findOne(id: number): Promise<MembershipTypeResponseDto> {
    const row = await this.membershipTypeRepository.findById(id);
    if (!row) throw new NotFoundException('Membership type not found');
    return row;
  }

  async update(
    id: number,
    updateMembershipTypeDto: UpdateMembershipTypeDto,
  ): Promise<MembershipTypeResponseDto> {
    await this.findOne(id);
    const data: UpdateMembershipTypeData = {};
    if (updateMembershipTypeDto.name !== undefined) data.name = updateMembershipTypeDto.name;
    if (updateMembershipTypeDto.price !== undefined) data.price = updateMembershipTypeDto.price;
    if (Object.keys(data).length === 0) {
      return this.findOne(id);
    }
    return this.membershipTypeRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.membershipTypeRepository.delete(id);
  }
}
