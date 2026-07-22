import { ReportePeriodo } from '../../application/services/reporte-periodo.service';
export declare function nombreArchivoReporteExcel(reporte: ReportePeriodo): string;
export declare function construirReporteExcel(reporte: ReportePeriodo): Promise<Buffer>;
