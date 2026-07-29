export enum EstadoFilaImportacion {
  OK = 'OK',
  /** Fecha fuera del rango del periodo pero sin conflicto: se pagará en este
   *  periodo con el cálculo de su fecha real (ver docs/02 §6). Importable por
   *  defecto, con su propio checkbox de inclusión (independiente de ADVERTENCIA). */
  RETROACTIVO = 'RETROACTIVO',
  ADVERTENCIA = 'ADVERTENCIA',
  ERROR = 'ERROR',
}
