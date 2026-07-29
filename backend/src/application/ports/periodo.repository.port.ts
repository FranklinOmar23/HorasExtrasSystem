import { Periodo } from '../../domain/entities/periodo.entity';

export const PERIODO_REPOSITORY = Symbol('PERIODO_REPOSITORY');

export interface CrearPeriodoDatos {
  fechaInicio: Date;
  fechaFin: Date;
}

export interface PeriodoRepository {
  /** No incluye periodos eliminados (soft-delete). */
  listar(): Promise<Periodo[]>;
  /** Periodos eliminados (soft-delete), para la vista de auditoría/restauración. */
  listarEliminados(): Promise<Periodo[]>;
  buscarPorId(id: string): Promise<Periodo | null>;
  buscarPorFechas(fechaInicio: Date, fechaFin: Date): Promise<Periodo | null>;
  crear(datos: CrearPeriodoDatos): Promise<Periodo>;
  cerrar(id: string, cerradoPorId: string, cerradoEn: Date): Promise<Periodo>;
  /** Soft-delete: no borra la fila ni sus registros/importaciones asociados. */
  eliminar(
    id: string,
    eliminadoPorId: string,
    eliminadoEn: Date,
  ): Promise<Periodo>;
  /** Revierte un soft-delete (limpia eliminadoEn/eliminadoPorId). */
  restaurar(id: string): Promise<Periodo>;
  /** Borra físicamente el periodo y su historial asociado (registros, cálculos,
   *  importaciones). Irreversible — solo para periodos ya en la papelera. */
  eliminarPermanentemente(id: string): Promise<void>;
}
