import Decimal from 'decimal.js';
import { TipoHoraExtraCodigo } from '../enums/tipo-hora-extra-codigo.enum';

export class Calculo {
  constructor(
    public readonly id: string,
    public readonly registroId: string,
    public readonly tipoHoraId: string,
    public readonly tipoHoraCodigo: TipoHoraExtraCodigo,
    public readonly cantidadHoras: Decimal,
    public readonly porcentajeAplicado: Decimal,
    public readonly salarioHoraUsado: Decimal,
    public readonly monto: Decimal,
    public readonly calculadoEn: Date,
  ) {}
}
