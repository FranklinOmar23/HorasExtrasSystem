import Decimal from 'decimal.js';
import { TipoHoraExtraCodigo } from '../enums/tipo-hora-extra-codigo.enum';
import { ModoValorizacion } from '../enums/modo-valorizacion.enum';
export declare class TipoHoraExtra {
    readonly id: string;
    readonly codigo: TipoHoraExtraCodigo;
    readonly nombre: string;
    readonly porcentaje: Decimal;
    readonly modoValorizacion: ModoValorizacion;
    readonly activo: boolean;
    constructor(id: string, codigo: TipoHoraExtraCodigo, nombre: string, porcentaje: Decimal, modoValorizacion: ModoValorizacion, activo: boolean);
    multiplicador(): Decimal;
}
