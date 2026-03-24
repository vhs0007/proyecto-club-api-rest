import { User } from '../../users/entities/user.entity';

export class TimeEntry {
    private _id: number;
    private _clubId: number;
    private _user: User;
    private _userDocument: string;
    private _clockIn: Date;
    private _clockOut?: Date | null;
    private _userId: number;

    constructor(data: Partial<TimeEntry>) {
        if (data?.id != null) this._id = data.id;
        if (data?.clubId != null) this._clubId = data.clubId;
        if (data?.user != null) this._user = data.user;
        if (data?.userDocument != null) this._userDocument = data.userDocument;
        if (data?.clockIn != null) this._clockIn = data.clockIn;
        if (data?.clockOut != null) this._clockOut = data.clockOut;
        if (data?.userId != null) this._userId = data.userId;
    }
    
    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }
    get userId(): number {
        return this._userId;
    }
    set userId(value: number) {
        this._userId = value;
    }
    get user(): User {
        return this._user;
    }
    set user(value: User) {
        this._user = value;
    }
    get clockIn(): Date {
        return this._clockIn;
    }
    set clockIn(value: Date) {
        this._clockIn = value;
    }
    get userDocument(): string {
        return this._userDocument;
    }
    set userDocument(value: string) {
        this._userDocument = value;
    }
    get clubId(): number {
        return this._clubId;
    }
    set clubId(value: number) {
        this._clubId = value;
    }
    get clockOut(): Date | null {
        return this._clockOut ?? null;
    }
    set clockOut(value: Date | null) {
        this._clockOut = value;
    }
}
