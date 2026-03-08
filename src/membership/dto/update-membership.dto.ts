import { CreateMembershipDto } from './create-membership.dto';
import { MembershipType } from '../entities/membership.entity';

export interface UpdateMembershipDto extends Partial<CreateMembershipDto> {
    type: number;
    price: number;
    facilitiesIncluded?: string[];
}
