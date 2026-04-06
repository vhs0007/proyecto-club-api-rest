import { User, UserType } from './user.entity';

export class Worker extends User {
  private _salary: number;
  private _hoursToWorkPerDay: number | null;
  private _startWorkAt: String;
  private _endWorkAt: String;

  constructor(data: Partial<Worker>) {
    super(data);
    if (data?.salary != null) this._salary = data.salary;
    if (data?.hoursToWorkPerDay !== undefined) this._hoursToWorkPerDay = data.hoursToWorkPerDay;
    if (data?.startWorkAt != null) this._startWorkAt = data.startWorkAt;
    if (data?.endWorkAt != null) this._endWorkAt = data.endWorkAt;
  }

  override get type(): UserType {
    return UserType.WORKER;
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

  get startWorkAt(): String {
    return this._startWorkAt;
  }
  set startWorkAt(value: String) {
    this._startWorkAt = value;
  }

  get endWorkAt(): String {
    return this._endWorkAt;
  }
  set endWorkAt(value: String) {
    this._endWorkAt = value;
  }
}