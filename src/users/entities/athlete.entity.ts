import { Member } from './member.entity';
import { UserType } from './user.entity';

export class Athlete extends Member {
  override readonly type: UserType = UserType.ATHLETE;
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

  constructor(data: Partial<Athlete>) {
    super(data);
    Object.assign(this, data);
  }
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}
