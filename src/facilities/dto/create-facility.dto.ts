
export interface CreateFacilityDto {
  tipo: string;
  horarioDisponible: string;
  aforo: number;
  trabajadorEncargado: number;
  trabajadorAyudante?: number;
  isActive?: boolean;
  createdAt?: Date;
}

