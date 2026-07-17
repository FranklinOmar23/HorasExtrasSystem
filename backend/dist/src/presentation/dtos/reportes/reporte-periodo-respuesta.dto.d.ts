import { PeriodoRespuestaDto } from '../periodos/periodo-respuesta.dto';
import { FilaReportePeriodoDto } from './fila-reporte-periodo.dto';
export declare class ReportePeriodoRespuestaDto {
    periodo: PeriodoRespuestaDto;
    filas: FilaReportePeriodoDto[];
    granTotal: string;
}
