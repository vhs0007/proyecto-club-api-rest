import { User } from "./user.entity";

export class Member extends User {
  role: MemberRole | null;
}

export enum MemberRole {
    Standard = 'standard',
    VIP = 'vip',
    ATHLETE = 'athlete',
}