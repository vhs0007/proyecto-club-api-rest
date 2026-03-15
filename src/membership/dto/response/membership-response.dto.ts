import { membershipTypeNavigation, userNavigation } from "src/membership/repository/membership.repository";

export class MembershipResponseDto {
  id: number;
  user: userNavigation;
  membershipType: membershipTypeNavigation;
}