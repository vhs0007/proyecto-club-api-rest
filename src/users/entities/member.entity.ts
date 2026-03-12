import { User, UserType } from './user.entity';

export class Member extends User {
  private _role: MemberRole | null;

  constructor(data: Partial<Member>) {
    super(data);
    this._role = data?.role ?? null;
  }

  override get type(): UserType {
    return UserType.MEMBER;
  }

  get role(): MemberRole | null {
    return this._role;
  }
  set role(value: MemberRole | null) {
    this._role = value;
  }
}

export enum MemberRole {
  Standard = 1,
  VIP = 2,
  ATHLETE = 3,
}
