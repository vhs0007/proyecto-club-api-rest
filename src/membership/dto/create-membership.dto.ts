import { MembershipType } from "../entities/membership.entity";

export interface CreateMembershipDto {
    type: MembershipType;
    price: number;
    facilitiesIncluded?: string[];
}
