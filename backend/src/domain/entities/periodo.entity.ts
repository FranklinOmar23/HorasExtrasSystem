import { EstadoPeriodo } from '../enums/estado-periodo.enum';

export class Periodo {
  constructor(
    public readonly id: string,
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date,
    public readonly estado: EstadoPeriodo,
    public readonly cerradoEn: Date | null,
    public readonly cerradoPorId: string | null,
  ) {}

  estaCerrado(): boolean {
    return this.estado === EstadoPeriodo.CERRADO;
  }
}
