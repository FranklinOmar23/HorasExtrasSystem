import Decimal from 'decimal.js';

export class Salario {
  constructor(
    public readonly id: string,
    public readonly empleadoId: string,
    public readonly montoMensual: Decimal,
    public readonly vigenteDesde: Date,
    public readonly vigenteHasta: Date | null,
  ) {}

  estaVigenteEn(fecha: Date): boolean {
    if (this.vigenteDesde > fecha) {
      return false;
    }
    return this.vigenteHasta === null || this.vigenteHasta >= fecha;
  }
}
