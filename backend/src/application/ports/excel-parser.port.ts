export const EXCEL_PARSER = Symbol('EXCEL_PARSER');

/**
 * Una fila cruda extraída del archivo, ya normalizada a tipos primitivos
 * (fecha como Date UTC a medianoche, horas como "HH:mm") pero SIN ninguna
 * validación de negocio todavía — eso lo hace ValidarFilasImportacionService.
 * `linea` es el número de fila tal como aparece en Excel (1 = encabezado).
 */
export interface FilaExcelCruda {
  linea: number;
  fecha: Date | null;
  codigo: number | null;
  nombreCrudo: string | null;
  horaEntrada: string | null;
  horaSalida: string | null;
}

export interface ExcelParserPort {
  /** Lanza ImportacionFormatoInvalidoError si el archivo no es un xlsx legible
   *  o no tiene las columnas mínimas reconocibles (fecha, código, entrada, salida). */
  parsear(contenido: Buffer): FilaExcelCruda[];
}
