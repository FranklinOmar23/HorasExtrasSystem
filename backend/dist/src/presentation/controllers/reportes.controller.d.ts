import { StreamableFile } from '@nestjs/common';
import { ObtenerReporteEmpleadoUseCase } from '../../application/use-cases/reportes/obtener-reporte-empleado.use-case';
import { ObtenerReporteHistoricoUseCase } from '../../application/use-cases/reportes/obtener-reporte-historico.use-case';
import { ObtenerReportePeriodoUseCase } from '../../application/use-cases/reportes/obtener-reporte-periodo.use-case';
import { HistoricoPeriodoDto } from '../dtos/reportes/historico-periodo.dto';
import { HistoricoQueryDto } from '../dtos/reportes/historico-query.dto';
import { ReporteEmpleadoRespuestaDto } from '../dtos/reportes/reporte-empleado-respuesta.dto';
import { ReportePeriodoRespuestaDto } from '../dtos/reportes/reporte-periodo-respuesta.dto';
export declare class ReportesController {
    private readonly obtenerReportePeriodo;
    private readonly obtenerReporteEmpleado;
    private readonly obtenerReporteHistorico;
    constructor(obtenerReportePeriodo: ObtenerReportePeriodoUseCase, obtenerReporteEmpleado: ObtenerReporteEmpleadoUseCase, obtenerReporteHistorico: ObtenerReporteHistoricoUseCase);
    reportePeriodo(periodoId: string): Promise<ReportePeriodoRespuestaDto>;
    reporteEmpleado(periodoId: string, empleadoId: string): Promise<ReporteEmpleadoRespuestaDto>;
    reportePeriodoExcel(periodoId: string): Promise<StreamableFile>;
    historico(query: HistoricoQueryDto): Promise<HistoricoPeriodoDto[]>;
}
