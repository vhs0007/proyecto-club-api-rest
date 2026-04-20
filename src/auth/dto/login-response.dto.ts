
export interface LoginResponse {
  accessToken: string;
  role: string;
  clubId: number;
  userId?: number;
  email?: string;
  document?: string
  type?:number;
}