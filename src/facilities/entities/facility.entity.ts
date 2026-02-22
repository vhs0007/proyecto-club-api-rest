import { Facilities } from "./facilities.entity";

export class Facility extends Facilities {
  constructor(data: Partial<Facility>) {
    super(data);
    Object.assign(this, data);
  }
}

