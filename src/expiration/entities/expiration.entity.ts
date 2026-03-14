import { Member } from '../../users/entities/member.entity';
import { Membership } from '../../membership/entities/membership.entity';

export class Expiration {
  private _id: number;
  private _member: Member;
  private _expirationDate: Date;
  private _membership: Membership;

  constructor(data: Partial<Expiration>) {
    if (data?.id != null) this._id = data.id;
    if (data?.member != null) this._member = data.member;
    if (data?.expirationDate != null) this._expirationDate = data.expirationDate;
    if (data?.membership != null) this._membership = data.membership;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get member(): Member {
    return this._member;
  }
  set member(value: Member) {
    this._member = value;
  }

  get expirationDate(): Date {
    return this._expirationDate;
  }
  set expirationDate(value: Date) {
    this._expirationDate = value;
  }

  get membership(): Membership {
    return this._membership;
  }
  set membership(value: Membership) {
    this._membership = value;
  }
}
