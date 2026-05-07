export class Membership {
  private _id: number;
  private _type: number;
  private _expirationDate: Date;
  private _clubId: number;
  private _createdAt: Date;
  constructor(data: Partial<Membership>) {
    if (data?.id != null) this._id = data.id;
    if (data?.type != null) this._type = data.type;
    if (data?.expirationDate != null)
      this._expirationDate = data.expirationDate;
    if (data?.clubId != null) this._clubId = data.clubId;
    if (data?.createdAt != null) this._createdAt = data.createdAt;
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

  get clubId(): number {
    return this._clubId;
  }
  set clubId(value: number) {
    this._clubId = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
  set createdAt(value: Date) {
    this._createdAt = value;
  }
}

export enum MembershipType {
  BASIC = 'basic',
  VIP = 'vip',
  ATHLETE = 'athlete',
}
