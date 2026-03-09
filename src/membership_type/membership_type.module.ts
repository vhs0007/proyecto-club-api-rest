import { Module } from '@nestjs/common';
import { MembershipTypeService } from './membership_type.service';
import { MembershipTypeController } from './membership_type.controller';
import { MembershipTypeRepository } from './repository/membership_type.repository.impl';

@Module({
  controllers: [MembershipTypeController],
  providers: [MembershipTypeService, MembershipTypeRepository],
})
export class MembershipTypeModule {}
