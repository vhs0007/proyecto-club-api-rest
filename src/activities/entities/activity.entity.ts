import { Facility } from 'src/facilities/entities/facility.entity';

export class Activity {
  private _id: number;
  private _name: string;
  private _type: string;
  private _startAt: Date;
  private _endAt: Date;
  private _userId: number;
  private _cost: number;
  private _facility: Facility;
  private _isActive: boolean;

  constructor(data: Partial<Activity>) {
    if (data?.id != null) this._id = data.id;
    if (data?.name != null) this._name = data.name;
    if (data?.type != null) this._type = data.type;
    if (data?.startAt != null) this._startAt = data.startAt;
    if (data?.endAt != null) this._endAt = data.endAt;
    if (data?.userId != null) this._userId = data.userId;
    if (data?.cost != null) this._cost = data.cost;
    if (data?.facility != null) this._facility = data.facility;
    if (data?.isActive !== undefined) this._isActive = data.isActive;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value;
  }

  get startAt(): Date {
    return this._startAt;
  }
  set startAt(value: Date) {
    this._startAt = value;
  }

  get endAt(): Date {
    return this._endAt;
  }
  set endAt(value: Date) {
    this._endAt = value;
  }

  get userId(): number {
    return this._userId;
  }
  set userId(value: number) {
    this._userId = value;
  }

  get cost(): number {
    return this._cost;
  }
  set cost(value: number) {
    this._cost = value;
  }

  get facility(): Facility {
    return this._facility;
  }
  set facility(value: Facility) {
    this._facility = value;
  }

  get isActive(): boolean {
    return this._isActive;
  }
  set isActive(value: boolean) {
    this._isActive = value;
  }
}
