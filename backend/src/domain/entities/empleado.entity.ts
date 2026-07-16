export class Empleado {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly nombre: string,
    public readonly cargo: string | null,
    public readonly activo: boolean,
  ) {}
}
