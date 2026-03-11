import { Member } from './member.entity';
import { UserType } from './user.entity';

export class Athlete extends Member {
  private _weight: number;
  private _height: number;
  private _gender: Gender;
  private _birthDate: Date;
  private _diet: string | null;
  private _trainingPlan: string | null;
  private _medicalHistory: string | null;
  private _allergies: string | null;
  private _medications: string | null;
  private _medicalConditions: string | null;

  constructor(data: Partial<Athlete>) {
    super(data);
    if (data?.weight != null) this._weight = data.weight;
    if (data?.height != null) this._height = data.height;
    if (data?.gender != null) this._gender = data.gender;
    if (data?.birthDate != null) this._birthDate = data.birthDate;
    if (data?.diet !== undefined) this._diet = data.diet;
    if (data?.trainingPlan !== undefined) this._trainingPlan = data.trainingPlan;
    if (data?.medicalHistory !== undefined) this._medicalHistory = data.medicalHistory;
    if (data?.allergies !== undefined) this._allergies = data.allergies;
    if (data?.medications !== undefined) this._medications = data.medications;
    if (data?.medicalConditions !== undefined) this._medicalConditions = data.medicalConditions;
  }

  override get type(): UserType {
    return UserType.ATHLETE;
  }

  get weight(): number {
    return this._weight;
  }
  set weight(value: number) {
    this._weight = value;
  }

  get height(): number {
    return this._height;
  }
  set height(value: number) {
    this._height = value;
  }

  get gender(): Gender {
    return this._gender;
  }
  set gender(value: Gender) {
    this._gender = value;
  }

  get birthDate(): Date {
    return this._birthDate;
  }
  set birthDate(value: Date) {
    this._birthDate = value;
  }

  get diet(): string | null {
    return this._diet;
  }
  set diet(value: string | null) {
    this._diet = value;
  }

  get trainingPlan(): string | null {
    return this._trainingPlan;
  }
  set trainingPlan(value: string | null) {
    this._trainingPlan = value;
  }

  get medicalHistory(): string | null {
    return this._medicalHistory;
  }
  set medicalHistory(value: string | null) {
    this._medicalHistory = value;
  }

  get allergies(): string | null {
    return this._allergies;
  }
  set allergies(value: string | null) {
    this._allergies = value;
  }

  get medications(): string | null {
    return this._medications;
  }
  set medications(value: string | null) {
    this._medications = value;
  }

  get medicalConditions(): string | null {
    return this._medicalConditions;
  }
  set medicalConditions(value: string | null) {
    this._medicalConditions = value;
  }
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}
