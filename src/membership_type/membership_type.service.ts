import { Injectable, NotFoundException } from '@nestjs/common';
import { MembershipTypeRepository } from './repository/membership_type.repository.impl';
import type { MembershipTypeResponseDto } from './dto/response/membership_type-response.dto';
import type { CreateMembershipTypeDto } from './dto/request/create-membership_type.dto';
import type { UpdateMembershipTypeDto } from './dto/request/update-membership_type.dto';
import type { UpdateMembershipTypeData } from './repository/membership_type.repository';
import { QueryMembershipTypeRequestDto } from './dto/request/query-membership_type.request.dto';


@Injectable()
export class MembershipTypeService {
  constructor(private readonly membershipTypeRepository: MembershipTypeRepository) {}

  async findAll(clubId: number): Promise<MembershipTypeResponseDto[]> {
    return this.membershipTypeRepository.findAll(clubId);
  }

   async create(dto: CreateMembershipTypeDto): Promise<MembershipTypeResponseDto> {
     return this.membershipTypeRepository.create({ name: dto.name, price: dto.price, clubId: dto.clubId });
   }

  async findOne(queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto): Promise<MembershipTypeResponseDto> {
    const { clubId, id } = queryMembershipTypeRequestDto;
    const row = await this.membershipTypeRepository.findById({ clubId, id });
    if (!row) throw new NotFoundException('Membership type not found');
    return row;
  }

  async update(
    queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto,
    updateMembershipTypeDto: UpdateMembershipTypeDto,
  ): Promise<MembershipTypeResponseDto> {
    await this.findOne(queryMembershipTypeRequestDto);
    const data: UpdateMembershipTypeData = {};
    if (updateMembershipTypeDto.name !== undefined) data.name = updateMembershipTypeDto.name;
    if (updateMembershipTypeDto.price !== undefined) data.price = updateMembershipTypeDto.price;
    if (Object.keys(data).length === 0) {
      return this.findOne(queryMembershipTypeRequestDto);
    }
    return this.membershipTypeRepository.update(queryMembershipTypeRequestDto, data);
  }

  async remove(queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto): Promise<void> {
    await this.membershipTypeRepository.delete(queryMembershipTypeRequestDto);
  }
}
