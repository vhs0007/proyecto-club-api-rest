import { Membership } from 'src/membership/entities/membership.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { MembershipType } from 'src/membership_type/entities/membership_type.entity';
import { Worker } from 'src/users/entities/worker.entity';

export class Facility {
  private _id: number;
  private _type: string;
  private _capacity: number;
  private _responsibleWorker: Worker;
  private _assistantWorker: Worker | null;
  private _isActive: boolean;
  private _membershipTypes: MembershipType[];

  constructor(data: Partial<Facility>) {
    if (data?.id != null) this._id = data.id;
    if (data?.type != null) this._type = data.type;
    if (data?.capacity != null) this._capacity = data.capacity;
    if (data?.responsibleWorker != null) this._responsibleWorker = data.responsibleWorker;
    if (data?.assistantWorker !== undefined) this._assistantWorker = data.assistantWorker;
    if (data?.isActive !== undefined) this._isActive = data.isActive;
    this._membershipTypes = (data as any)?.membershipTypes ?? [];
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

  get responsibleWorker(): Worker {
    return this._responsibleWorker;
  }

  set responsibleWorker(value: Worker) {
    this._responsibleWorker = value;
  }

  get assistantWorker(): Worker | null {
    return this._assistantWorker;
  }

  set assistantWorker(value: Worker | null) {
    this._assistantWorker = value;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  get membershipTypes(): MembershipType[] {
    return this._membershipTypes;
  }

  set membershipTypes(value: MembershipType[]) {
    this._membershipTypes = value;
  }
}


