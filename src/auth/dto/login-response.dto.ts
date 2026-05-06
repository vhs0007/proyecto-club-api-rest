export interface LoginResponse {
  accessToken: string;
  role: string;
  clubId: number;
  userTypeId?: number;
  membershipTypeId?: number;
  userId?: number;
  email?: string;
  document?: string
}