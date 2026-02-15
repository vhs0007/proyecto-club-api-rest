import { Member } from "./member.entity";

export class Athlete extends Member {
  readonly kind = 'athlete' as const;
  weight: number;
  height: number;
  gender: Gender;
  birthDate: Date;
  diet : string | null;
  trainingPlan : string | null;
  medicalHistory : string | null;
  allergies : string | null;
  medications : string | null;
  medicalConditions : string | null;
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}
