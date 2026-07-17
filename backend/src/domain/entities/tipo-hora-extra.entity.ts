import Decimal from 'decimal.js';
import { TipoHoraExtraCodigo } from '../enums/tipo-hora-extra-codigo.enum';
import { ModoValorizacion } from '../enums/modo-valorizacion.enum';

export class TipoHoraExtra {
  constructor(
    public readonly id: string,
    public readonly codigo: TipoHoraExtraCodigo,
    public readonly nombre: string,
    public readonly porcentaje: Decimal,
    public readonly modoValorizacion: ModoValorizacion,
    public readonly activo: boolean,
  ) {}

  /** Factor por el que se multiplica salario_hora × cantidad_horas para obtener el monto. */
  multiplicador(): Decimal {
    const fraccion = this.porcentaje.dividedBy(100);
    return this.modoValorizacion === ModoValorizacion.COMPLETA
      ? fraccion.plus(1)
      : fraccion;
  }
}
