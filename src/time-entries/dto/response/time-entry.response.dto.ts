import { userNavigation } from "src/time-entries/repository/time-entry.repository";

export interface TimeEntryResponseDto {
    id: number;
    clubId: number;
    user: userNavigation;
    userDocument: string;
    clockIn: Date;
    clockOut?: Date | null;
  }