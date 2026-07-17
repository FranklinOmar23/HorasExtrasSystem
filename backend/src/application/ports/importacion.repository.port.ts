import { Importacion } from '../../domain/entities/importacion.entity';

export const IMPORTACION_REPOSITORY = Symbol('IMPORTACION_REPOSITORY');

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
  /** El contenido binario original se guarda aparte para no cargarlo en cada
   *  listado; solo se necesita al confirmar (se vuelve a parsear y validar). */
  obtenerContenido(id: string): Promise<Buffer | null>;
  listarPorPeriodo(periodoId: string): Promise<Importacion[]>;
  marcarConfirmada(id: string, confirmadaEn: Date): Promise<Importacion>;
}
