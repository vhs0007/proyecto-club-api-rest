export class Membership {
  id: number;
  type: number;

  constructor(data: Partial<Membership>) {
    Object.assign(this, data);
  }
}

export enum MembershipType {
  BASIC = 'basic',
  VIP = 'vip',
  ATHLETE = 'athlete',
}
