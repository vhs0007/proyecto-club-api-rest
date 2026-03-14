import { User, UserType } from './user.entity';

export class Worker extends User {
  private _role: WorkerRole;
  private _salary: number;
  private _hoursToWorkPerDay: number | null;
  private _startWorkAt: Date;
  private _endWorkAt: Date;

  constructor(data: Partial<Worker>) {
    super(data);
    if (data?.role != null) this._role = data.role;
    if (data?.salary != null) this._salary = data.salary;
    if (data?.hoursToWorkPerDay !== undefined) this._hoursToWorkPerDay = data.hoursToWorkPerDay;
    if (data?.startWorkAt != null) this._startWorkAt = data.startWorkAt;
    if (data?.endWorkAt != null) this._endWorkAt = data.endWorkAt;
  }

  override get type(): UserType {
    return UserType.WORKER;
  }

  get role(): WorkerRole {
    return this._role;
  }
  set role(value: WorkerRole) {
    this._role = value;
  }

  get salary(): number {
    return this._salary;
  }
  set salary(value: number) {
    this._salary = value;
  }

  get hoursToWorkPerDay(): number | null {
    return this._hoursToWorkPerDay;
  }
  set hoursToWorkPerDay(value: number | null) {
    this._hoursToWorkPerDay = value;
  }

  get startWorkAt(): Date {
    return this._startWorkAt;
  }
  set startWorkAt(value: Date) {
    this._startWorkAt = value;
  }

  get endWorkAt(): Date {
    return this._endWorkAt;
  }
  set endWorkAt(value: Date) {
    this._endWorkAt = value;
  }
}

export enum WorkerRole {
  ADMIN = 1,
  COACH = 2,
  NUTRITIONIST = 3,
  PSYCHOLOGIST = 4,
  PHYSICAL_THERAPIST = 5,
  ADMINISTRATIVE = 6,
  CLEANER = 7,
}
