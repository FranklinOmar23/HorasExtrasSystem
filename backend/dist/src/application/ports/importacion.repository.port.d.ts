import { Importacion } from '../../domain/entities/importacion.entity';
export declare const IMPORTACION_REPOSITORY: unique symbol;
export interface CrearImportacionDatos {
    periodoId: string;
    usuarioId: string;
    archivo: string;
    contenido: Buffer;
    filasOk: number;
    filasAdvertencia: number;
    filasError: number;
}
export interface ImportacionRepository {
    crear(datos: CrearImportacionDatos): Promise<Importacion>;
    buscarPorId(id: string): Promise<Importacion | null>;
    obtenerContenido(id: string): Promise<Buffer | null>;
    listarPorPeriodo(periodoId: string): Promise<Importacion[]>;
    marcarConfirmada(id: string, confirmadaEn: Date): Promise<Importacion>;
}
