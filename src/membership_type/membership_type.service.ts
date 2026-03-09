import { Injectable } from '@nestjs/common';
import { UpdateMembershipTypeDto } from './dto/update-membership_type.dto';
import { MembershipTypeRepository } from './repository/membership_type.repository.impl';
import { MembershipType } from './entities/membership_type.entity';

@Injectable()
export class MembershipTypeService {
  constructor(private readonly membershipTypeRepository: MembershipTypeRepository) {}

  /*create(createMembershipTypeDto: CreateMembershipTypeDto) {
    return 'This action adds a new membershipType';
  }*/

  findAll() {
    return this.membershipTypeRepository.findAll();
  }

  findOne(id: number) {
    return this.membershipTypeRepository.findById(id);
  }

  update(id: number, updateMembershipTypeDto: MembershipType) {
    return this.membershipTypeRepository.update(id, updateMembershipTypeDto);
  }

  remove(id: number) {
    return this.membershipTypeRepository.delete(id);
  }
}
