import { User, UserType } from "./user.entity";

export class Member extends User {
  override readonly type: UserType = UserType.MEMBER;
  role: MemberRole | null;

  constructor(data: Partial<Member>) {
    super(data);
    Object.assign(this, data);
  }
}

export enum MemberRole {
    Standard = 'standard',
    VIP = 'vip',
    ATHLETE = 'athlete',
}