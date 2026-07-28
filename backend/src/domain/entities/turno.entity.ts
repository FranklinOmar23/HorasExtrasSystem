import Decimal from 'decimal.js';

export class Turno {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly nombre: string,
    public readonly horaInicio: string,
    public readonly horaFin: string,
    public readonly horasJornada: Decimal,
    public readonly cruzaMedianoche: boolean,
    public readonly descuentaAlmuerzo: boolean,
    public readonly activo: boolean,
  ) {}
}
