export class Importacion {
  constructor(
    public readonly id: string,
    public readonly periodoId: string,
    public readonly usuarioId: string,
    public readonly archivo: string,
    public readonly filasOk: number,
    public readonly filasAdvertencia: number,
    public readonly filasError: number,
    public readonly filasRetroactivas: number,
    public readonly importadoEn: Date,
    public readonly confirmadaEn: Date | null,
  ) {}

  estaConfirmada(): boolean {
    return this.confirmadaEn !== null;
  }
}
