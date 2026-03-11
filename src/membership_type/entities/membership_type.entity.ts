export class MembershipType {
  private _id: number;
  private _name: string;
  private _price: number;

  constructor(data: Partial<MembershipType>) {
    if (data?.id != null) this._id = data.id;
    if (data?.name != null) this._name = data.name;
    if (data?.price != null) this._price = data.price;
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

  get price(): number {
    return this._price;
  }
  set price(value: number) {
    this._price = value;
  }
}
