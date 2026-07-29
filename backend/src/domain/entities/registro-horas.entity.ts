import { OrigenRegistro } from '../enums/origen-registro.enum';

export class RegistroHoras {
  constructor(
    public readonly id: string,
    public readonly periodoId: string,
    public readonly empleadoId: string,
    public readonly fecha: Date,
    public readonly horaEntrada: string,
    public readonly horaSalida: string,
    public readonly origen: OrigenRegistro,
    public readonly importacionId: string | null,
    public readonly comentario: string | null,
    public readonly esRetroactivo: boolean,
  ) {}
}
