import { Member } from '../../users/entities/member.entity';
import { Membership } from '../../membership/entities/membership.entity';

export class Expiration {
  id: number;
  member: Member;
  expirationDate: Date;
  membership: Membership;

  constructor(data: Partial<Expiration>) {
    Object.assign(this, data);
  }
}
