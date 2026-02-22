export class Membership {
    id: number;
    type: MembershipType;
    price: number;
    facilitiesIncluded?: string[];
    
    constructor(data: Partial<Membership>) {
        Object.assign(this, data);
    }
}


export enum MembershipType {
    BASIC = 'basic',
    VIP = 'vip',
    ATHLETE = 'athlete',
}