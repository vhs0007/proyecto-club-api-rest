export class UserType {
  private _id: number;
  private _name: string;

  constructor(data: Partial<UserType>) {
    if (data?.id != null) this._id = data.id;
    if (data?.name != null) this._name = data.name;
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
}
