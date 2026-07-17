import Decimal from 'decimal.js';
import { TipoHoraExtraCodigo } from '../enums/tipo-hora-extra-codigo.enum';

export class TipoHoraExtra {
  constructor(
    public readonly id: string,
    public readonly codigo: TipoHoraExtraCodigo,
    public readonly nombre: string,
    public readonly porcentaje: Decimal,
    public readonly activo: boolean,
  ) {}
}
