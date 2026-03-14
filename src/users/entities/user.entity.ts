export abstract class User {
  private _id: number;
  private _name: string;
  private _type: UserType;
  private _createdAt: Date;
  private _email: string | null;
  private _password: string | null;
  private _updatedAt: Date | null;
  private _deletedAt: Date | null;
  private _isActive: boolean;

  constructor(data: Partial<User>) {
    if (data?.id != null) this._id = data.id;
    if (data?.name != null) this._name = data.name;
    if (data?.type != null) this._type = data.type;
    if (data?.createdAt != null) this._createdAt = data.createdAt;
    if (data?.email !== undefined) this._email = data.email;
    if (data?.password !== undefined) this._password = data.password;
    if (data?.updatedAt !== undefined) this._updatedAt = data.updatedAt;
    if (data?.deletedAt !== undefined) this._deletedAt = data.deletedAt;
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

  get type(): UserType {
    return this._type;
  }
  set type(value: UserType) {
    this._type = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get email(): string | null {
    return this._email;
  }
  set email(value: string | null) {
    this._email = value;
  }

  get password(): string | null {
    return this._password;
  }
  set password(value: string | null) {
    this._password = value;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }
  set updatedAt(value: Date | null) {
    this._updatedAt = value;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }
  set deletedAt(value: Date | null) {
    this._deletedAt = value;
  }

  get isActive(): boolean {
    return this._isActive;
  }
  set isActive(value: boolean) {
    this._isActive = value;
  }
}

export enum UserType {
  WORKER = 1,
  ATHLETE = 2,
  MEMBER = 3,
}
