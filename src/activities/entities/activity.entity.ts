import { Facility } from 'src/facilities/entities/facility.entity';
import { User } from 'src/users/entities/user.entity';

export class Activity {
  private _id: number;
  private _name: string;
  private _type: string;
  private _hourStart: string;
  private _hourEnd: string;
  private _user: User;
  private _cost: number;
  private _facility: Facility;
  private _state: string;
  private _date: Date;

  constructor(data: Partial<Activity>) {
    if (data?.id != null) this._id = data.id;
    if (data?.name != null) this._name = data.name;
    if (data?.type != null) this._type = data.type;
    if (data?.hourStart != null) this._hourStart = data.hourStart;
    if (data?.hourEnd != null) this._hourEnd = data.hourEnd;
    if (data?.user != null) this._user = data.user;
    if (data?.cost != null) this._cost = data.cost;
    if (data?.facility != null) this._facility = data.facility;
    if (data?.state != null) this._state = data.state;
    if (data?.date != null) this._date = data.date;
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

  get hourStart(): string {
    return this._hourStart;
  }
  set hourStart(value: string) {
    this._hourStart = value;
  }

  get hourEnd(): string {
    return this._hourEnd;
  }
  set hourEnd(value: string) {
    this._hourEnd = value;
  }

  get user(): User {
    return this._user;
  }
  set user(value: User) {
    this._user = value;
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

  get state(): string {
    return this._state;
  }
  set state(value: string) {
    this._state = value;
  }

  get date(): Date {
    return this._date;
  }
  set date(value: Date) {
    this._date = value;
  }
}
