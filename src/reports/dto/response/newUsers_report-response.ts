import { UserResponseDto } from "src/users/dto/response/user.response.dto";

export class NewUsersReportResponseDto {
  users: UserResponseDto[];
  totalUsers: number;
}
