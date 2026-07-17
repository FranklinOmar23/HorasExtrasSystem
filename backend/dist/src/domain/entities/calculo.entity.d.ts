import Decimal from 'decimal.js';
import { TipoHoraExtraCodigo } from '../enums/tipo-hora-extra-codigo.enum';
export declare class Calculo {
    readonly id: string;
    readonly registroId: string;
    readonly tipoHoraId: string;
    readonly tipoHoraCodigo: TipoHoraExtraCodigo;
    readonly cantidadHoras: Decimal;
    readonly porcentajeAplicado: Decimal;
    readonly salarioHoraUsado: Decimal;
    readonly monto: Decimal;
    readonly calculadoEn: Date;
    constructor(id: string, registroId: string, tipoHoraId: string, tipoHoraCodigo: TipoHoraExtraCodigo, cantidadHoras: Decimal, porcentajeAplicado: Decimal, salarioHoraUsado: Decimal, monto: Decimal, calculadoEn: Date);
}
