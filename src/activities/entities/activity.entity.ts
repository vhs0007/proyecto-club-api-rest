import { Activities } from "./activities.entity";

export class Activity extends Activities {
  constructor(data: Partial<Activity>) {
    super(data);
    Object.assign(this, data);
  }
}

