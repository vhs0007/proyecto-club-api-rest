import { MembershipType } from "../entities/membership.entity";
import {ApiProperty} from '@nestjs/swagger';

export class CreateMembershipDto {
    @ApiProperty({ example: '1', description: 'Id tipo membrecia' })
    type: number;
    @ApiProperty({ example: '200', description: 'Precio' })
    price: number;
    @ApiProperty({ example: 'Gym', description: 'Sala: ' })
    facilitiesIncluded?: string[];
}
