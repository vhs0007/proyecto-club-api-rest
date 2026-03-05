import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { MembershipRepository } from './repository/membership.repository.impl';

@Module({
  controllers: [MembershipController],
  providers: [MembershipService, MembershipRepository],
})
export class MembershipModule {}
