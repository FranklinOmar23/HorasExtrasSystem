export declare const EXCEL_PARSER: unique symbol;
export interface FilaExcelCruda {
    linea: number;
    fecha: Date | null;
    codigo: number | null;
    nombreCrudo: string | null;
    horaEntrada: string | null;
    horaSalida: string | null;
}
export interface ExcelParserPort {
    parsear(contenido: Buffer): FilaExcelCruda[];
}
