import { EstadoPeriodo } from '../enums/estado-periodo.enum';

export class Periodo {
  constructor(
    public readonly id: string,
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date,
    public readonly estado: EstadoPeriodo,
    public readonly cerradoEn: Date | null,
    public readonly cerradoPorId: string | null,
    public readonly eliminadoEn: Date | null,
    public readonly eliminadoPorId: string | null,
  ) {}

  estaCerrado(): boolean {
    return this.estado === EstadoPeriodo.CERRADO;
  }

  estaEliminado(): boolean {
    return this.eliminadoEn !== null;
  }
}
