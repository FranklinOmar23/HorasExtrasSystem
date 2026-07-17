import { OrigenRegistro } from '../enums/origen-registro.enum';
export declare class RegistroHoras {
    readonly id: string;
    readonly periodoId: string;
    readonly empleadoId: string;
    readonly fecha: Date;
    readonly horaEntrada: string;
    readonly horaSalida: string;
    readonly origen: OrigenRegistro;
    readonly importacionId: string | null;
    readonly comentario: string | null;
    constructor(id: string, periodoId: string, empleadoId: string, fecha: Date, horaEntrada: string, horaSalida: string, origen: OrigenRegistro, importacionId: string | null, comentario: string | null);
}
