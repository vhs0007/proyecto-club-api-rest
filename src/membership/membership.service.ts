import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership, MembershipType } from './entities/membership.entity';

@Injectable()
export class MembershipService {
  memberships: Membership[] = [
    new Membership({
      id: 1,
      type: MembershipType.BASIC,
      price: 100,
      facilitiesIncluded: ['gym', 'pool', 'sauna'],
    }),
    new Membership({
      id: 2,
      type: MembershipType.VIP,
      price: 200,
      facilitiesIncluded: ['gym', 'pool', 'sauna', 'spa'],
    }),
    new Membership({
      id: 3,
      type: MembershipType.ATHLETE,
      price: 300,
      facilitiesIncluded: ['gym', 'pool', 'sauna', 'spa', 'tennis'],
    }),
  ];

  create(createMembershipDto: CreateMembershipDto) {
    const membership = new Membership(createMembershipDto);
    this.memberships.push(membership);
    return membership;
  }

  findAll() {
    return this.memberships;
  }

  findOne(id: number) {
    return this.memberships.find(membership => membership.id === id);
  }

  update(id: number, updateMembershipDto: UpdateMembershipDto) {
    const membership = this.memberships.find(membership => membership.id === id);
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }
    Object.assign(membership, updateMembershipDto);
    return membership;
  }

  remove(id: number) {
    const membership = this.memberships.find(membership => membership.id === id);
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }
    this.memberships = this.memberships.filter(membership => membership.id !== id);
    return membership;
  }
}
