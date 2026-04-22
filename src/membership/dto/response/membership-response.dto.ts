import { membershipTypeNavigation, userNavigation } from "../../repository/membership.repository";

export class MembershipResponseDto {
  id: number;
  user: userNavigation;
  membershipType: membershipTypeNavigation;
  expiration: Date;
  createdAt: Date;
}