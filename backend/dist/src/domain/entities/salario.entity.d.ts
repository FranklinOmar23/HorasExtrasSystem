import Decimal from 'decimal.js';
export declare class Salario {
    readonly id: string;
    readonly empleadoId: string;
    readonly montoMensual: Decimal;
    readonly vigenteDesde: Date;
    readonly vigenteHasta: Date | null;
    constructor(id: string, empleadoId: string, montoMensual: Decimal, vigenteDesde: Date, vigenteHasta: Date | null);
    estaVigenteEn(fecha: Date): boolean;
}
