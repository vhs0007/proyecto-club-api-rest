import { DatetimeScheduledActivity } from "../request/create-scheduled_activity.dto";
import { FacilityNavigation, UserNavigation } from "../../repository/scheduled_activities.repository";

export class ScheduledActivityResponseDto {
    id: number;
    clubId: number;
    facility: FacilityNavigation;
    userId: number;
    user: UserNavigation;
    userTypeId: number;
    assistantWorkers: UserNavigation[];
    membershipTypesIds: number[];
    datetimeScheduledActivities: DatetimeScheduledActivity[];
    name: string;
}