import { Member } from '../../users/entities/member.entity';
import { Membership } from '../../membership/entities/membership.entity';

export class Expiration {
  id_expiration: number;
  socio: Member;
  exp_date: Date;
  membership: Membership;

  constructor(data: Partial<Expiration>) {
    Object.assign(this, data);
  }
}
