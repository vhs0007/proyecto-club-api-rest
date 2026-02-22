import { CreateFacilityDto } from './create-facility.dto';

export interface UpdateFacilityDto extends Partial<CreateFacilityDto> {
  id: number;
  tipo?: string;
  horarioDisponible?: string;
  aforo?: number;
  trabajadorEncargado?: number;
  trabajadorAyudante?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

