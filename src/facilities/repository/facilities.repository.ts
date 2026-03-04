import { Facility } from "../entities/facility.entity";
import { CreateFacilityDto } from "../dto/create-facility.dto";
import { UpdateFacilityDto } from "../dto/update-facility.dto";

export interface IFacilitiesRepository {
    create(createFacilityDto: CreateFacilityDto): Promise<Facility>;
    findAll(): Promise<Facility[]>;
    findById(id: string): Promise<Facility>;
    update(id: number, updateFacilityDto: UpdateFacilityDto): Promise<Facility>;
    delete(id: number): Promise<void>;
}