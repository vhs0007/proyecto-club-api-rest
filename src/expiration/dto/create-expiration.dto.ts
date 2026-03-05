import { Member } from '../../users/entities/member.entity';
import { Membership } from '../../membership/entities/membership.entity';

export interface CreateExpirationDto {
  id: number;
  socio: Member;
  exp_date: Date;
  membership: Membership;
}
