import { CalculoRespuestaDto } from './calculo-respuesta.dto';
export declare class RegistroRespuestaDto {
    id: string;
    periodoId: string;
    empleadoId: string;
    fecha: string;
    horaEntrada: string;
    horaSalida: string;
    origen: string;
    comentario: string | null;
    calculos: CalculoRespuestaDto[];
}
