import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez' })
  name: string;

  @ApiProperty({ example: 3, description: '1=WORKER, 2=ATHLETE, 3=MEMBER' })
  typeId: number;

  @ApiProperty({ required: false })
  email?: string | null;

  @ApiProperty({ required: false })
  password?: string | null;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ required: false })
  membershipId?: number | null;

  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty({ required: false })
  salary?: number | null;

  @ApiProperty({ required: false })
  hoursToWorkPerDay?: number | null;

  @ApiProperty({ required: false })
  startWorkAt?: Date | null;

  @ApiProperty({ required: false })
  endWorkAt?: Date | null;

  @ApiProperty({ required: false })
  weight?: number | null;

  @ApiProperty({ required: false })
  height?: number | null;

  @ApiProperty({ required: false })
  gender?: string | null;

  @ApiProperty({ required: false })
  birthDate?: Date | null;

  @ApiProperty({ required: false })
  diet?: string | null;

  @ApiProperty({ required: false })
  trainingPlan?: string | null;

  @ApiProperty({ required: false })
  medicalHistory?: string | null;

  @ApiProperty({ required: false })
  allergies?: string | null;

  @ApiProperty({ required: false })
  medications?: string | null;

  @ApiProperty({ required: false })
  medicalConditions?: string | null;
}
