export abstract class Facilities {
    id: number;
    tipo: string;
    horarioDisponible: string;
    aforo: number;
    trabajadorEncargado: number;
    trabajadorAyudante: number | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    isActive: boolean;
  
    constructor(data: Partial<Facilities>) {
      Object.assign(this, data);
    }
  }

