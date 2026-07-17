import { EstadoFilaImportacion } from '../../../domain/enums/estado-fila-importacion.enum';
export declare class FilaImportacionRespuestaDto {
    linea: number;
    fecha: string | null;
    codigo: number | null;
    nombre: string | null;
    entrada: string | null;
    salida: string | null;
    estado: EstadoFilaImportacion;
    mensajes: string[];
}
