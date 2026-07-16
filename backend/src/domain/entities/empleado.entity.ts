export class Empleado {
  constructor(
    public readonly id: string,
    public readonly codigo: number,
    public readonly nombre: string,
    public readonly cedula: string | null,
    public readonly posicion: string,
    public readonly activo: boolean,
  ) {}
}
