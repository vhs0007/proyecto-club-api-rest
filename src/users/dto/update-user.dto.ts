import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  email?: string | null;

  @ApiProperty({ required: false })
  password?: string | null;

  @ApiProperty({ required: false })
  salary?: number | null;

  @ApiProperty({ required: false })
  hoursToWorkPerDay?: number;

  @ApiProperty({ required: false })
  startWorkAt?: Date;

  @ApiProperty({ required: false })
  endWorkAt?: Date;

  @ApiProperty({ required: false })
  weight?: number;

  @ApiProperty({ required: false })
  height?: number;

  @ApiProperty({ required: false })
  gender?: string;

  @ApiProperty({ required: false })
  birthDate?: Date;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date | null;

  @ApiProperty({ required: false })
  isActive?: boolean;

  @ApiProperty({ required: false })
  diet?: string;

  @ApiProperty({ required: false })
  trainingPlan?: string;

  @ApiProperty({ required: false })
  medicalHistory?: string;

  @ApiProperty({ required: false })
  allergies?: string;

  @ApiProperty({ required: false })
  medications?: string;

  @ApiProperty({ required: false })
  medicalConditions?: string;

  @ApiProperty({ required: false })
  typeId?: number;

  @ApiProperty({ required: false })
  roleId?: number;

  @ApiProperty({ required: false })
  membershipId?: number | null;
}
