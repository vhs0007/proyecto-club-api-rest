export class Membership {
  private _id: number;
  private _type: number;
  private _expirationDate: Date;
  
  constructor(data: Partial<Membership>) {
    if (data?.id != null) this._id = data.id;
    if (data?.type != null) this._type = data.type;
    if (data?.expirationDate != null) this._expirationDate = data.expirationDate;
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

  get expirationDate(): Date {
    return this._expirationDate;
  }
  set expirationDate(value: Date) {
    this._expirationDate = value;
  }
}

export enum MembershipType {
  BASIC = 'basic',
  VIP = 'vip',
  ATHLETE = 'athlete',
}
