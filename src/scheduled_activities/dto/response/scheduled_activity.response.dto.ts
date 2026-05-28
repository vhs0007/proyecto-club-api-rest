import {
    DatetimeScheduledActivityNavigation,
    MembershipTypeNavigation,
} from 'src/facilities/repository/facilities.repository';
import { FacilityNavigation, UserNavigation } from '../../repository/scheduled_activities.repository';

export class ScheduledActivityResponseDto {
    id: number;
    clubId: number;
    facility: FacilityNavigation;
    userId: number;
    user: UserNavigation;
    userTypeId: number;
    assistantWorkers: UserNavigation[];
    membershipTypes: MembershipTypeNavigation[];
    datetimeScheduledActivities: DatetimeScheduledActivityNavigation[];
    name: string;
}
