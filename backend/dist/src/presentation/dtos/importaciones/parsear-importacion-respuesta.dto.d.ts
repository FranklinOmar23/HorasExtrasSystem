import { FilaImportacionRespuestaDto } from './fila-importacion-respuesta.dto';
export declare class ResumenImportacionDto {
    ok: number;
    advertencias: number;
    errores: number;
}
export declare class ParsearImportacionRespuestaDto {
    importacionId: string;
    filas: FilaImportacionRespuestaDto[];
    resumen: ResumenImportacionDto;
}
