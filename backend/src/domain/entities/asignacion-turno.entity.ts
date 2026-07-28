export class AsignacionTurno {
  constructor(
    public readonly id: string,
    public readonly empleadoId: string,
    public readonly turnoId: string,
    public readonly fechaDesde: Date,
    public readonly fechaHasta: Date | null,
    public readonly comentario: string | null,
    public readonly creadoPorId: string,
    public readonly createdAt: Date,
  ) {}

  /** true si la fecha cae dentro del rango de esta asignación. */
  cubre(fecha: Date): boolean {
    if (fecha < this.fechaDesde) return false;
    if (this.fechaHasta !== null && fecha > this.fechaHasta) return false;
    return true;
  }
}
