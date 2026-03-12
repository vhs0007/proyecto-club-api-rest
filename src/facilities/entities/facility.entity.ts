import { Membership } from 'src/membership/entities/membership.entity';

export class Facility {
  private _id: number;
  private _type: string;
  private _capacity: number;
  private _responsibleWorker: number;
  private _assistantWorker: number | null;
  private _isActive: boolean;
  private _membership: Membership[];

  constructor(data: Partial<Facility>) {
    if (data?.id != null) this._id = data.id;
    if (data?.type != null) this._type = data.type;
    if (data?.capacity != null) this._capacity = data.capacity;
    if (data?.responsibleWorker != null) this._responsibleWorker = data.responsibleWorker;
    if (data?.assistantWorker !== undefined) this._assistantWorker = data.assistantWorker;
    if (data?.isActive !== undefined) this._isActive = data.isActive;
    this._membership = (data as any)?.membership ?? [];
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get capacity(): number {
    return this._capacity;
  }

  set capacity(value: number) {
    this._capacity = value;
  }

  get responsibleWorker(): number {
    return this._responsibleWorker;
  }

  set responsibleWorker(value: number) {
    this._responsibleWorker = value;
  }

  get assistantWorker(): number | null {
    return this._assistantWorker;
  }

  set assistantWorker(value: number | null) {
    this._assistantWorker = value;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  get membership(): Membership[] {
    return this._membership;
  }

  set membership(value: Membership[]) {
    this._membership = value;
  }
}


