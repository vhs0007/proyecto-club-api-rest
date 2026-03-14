export class Membership {
  private _id: number;
  private _type: number;

  constructor(data: Partial<Membership>) {
    if (data?.id != null) this._id = data.id;
    if (data?.type != null) this._type = data.type;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get type(): number {
    return this._type;
  }
  set type(value: number) {
    this._type = value;
  }
}

export enum MembershipType {
  BASIC = 'basic',
  VIP = 'vip',
  ATHLETE = 'athlete',
}
