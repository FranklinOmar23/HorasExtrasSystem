import {
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Query,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ObtenerReporteEmpleadoUseCase } from '../../application/use-cases/reportes/obtener-reporte-empleado.use-case';
import { ObtenerReporteHistoricoUseCase } from '../../application/use-cases/reportes/obtener-reporte-historico.use-case';
import { ObtenerReportePeriodoUseCase } from '../../application/use-cases/reportes/obtener-reporte-periodo.use-case';
import {
  construirReporteExcel,
  nombreArchivoReporteExcel,
} from '../../infrastructure/excel/reporte-excel.builder';
import { HistoricoPeriodoDto } from '../dtos/reportes/historico-periodo.dto';
import { HistoricoQueryDto } from '../dtos/reportes/historico-query.dto';
import { ReporteEmpleadoRespuestaDto } from '../dtos/reportes/reporte-empleado-respuesta.dto';
import { ReportePeriodoRespuestaDto } from '../dtos/reportes/reporte-periodo-respuesta.dto';
import {
  aHistoricoPeriodoDto,
  aReporteEmpleadoRespuestaDto,
  aReportePeriodoRespuestaDto,
} from '../mappers/reporte.mapper';

const MESES_HISTORICO_DEFAULT = 6;

@ApiTags('reportes')
@ApiBearerAuth()
@Controller()
export class ReportesController {
  constructor(
    @Inject(ObtenerReportePeriodoUseCase)
    private readonly obtenerReportePeriodo: ObtenerReportePeriodoUseCase,
    @Inject(ObtenerReporteEmpleadoUseCase)
    private readonly obtenerReporteEmpleado: ObtenerReporteEmpleadoUseCase,
    @Inject(ObtenerReporteHistoricoUseCase)
    private readonly obtenerReporteHistorico: ObtenerReporteHistoricoUseCase,
  ) {}

  @Get('periodos/:periodoId/reporte')
  @ApiOperation({
    summary: 'Reporte de horas extra de un periodo, por empleado',
  })
  @ApiResponse({ status: 200, type: ReportePeriodoRespuestaDto })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  async reportePeriodo(
    @Param('periodoId') periodoId: string,
  ): Promise<ReportePeriodoRespuestaDto> {
    const reporte = await this.obtenerReportePeriodo.ejecutar(periodoId);
    return aReportePeriodoRespuestaDto(reporte);
  }

  @Get('periodos/:periodoId/reporte/empleados/:empleadoId')
  @ApiOperation({ summary: 'Detalle día por día de un empleado en un periodo' })
  @ApiResponse({ status: 200, type: ReporteEmpleadoRespuestaDto })
  @ApiResponse({
    status: 404,
    description: 'Periodo o empleado no encontrado',
  })
  async reporteEmpleado(
    @Param('periodoId') periodoId: string,
    @Param('empleadoId') empleadoId: string,
  ): Promise<ReporteEmpleadoRespuestaDto> {
    const reporte = await this.obtenerReporteEmpleado.ejecutar(
      periodoId,
      empleadoId,
    );
    return aReporteEmpleadoRespuestaDto(reporte);
  }

  @Get('periodos/:periodoId/reporte/excel')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @ApiOperation({ summary: 'Descarga el reporte del periodo como .xlsx' })
  @ApiResponse({ status: 200, description: 'Archivo .xlsx' })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  async reportePeriodoExcel(
    @Param('periodoId') periodoId: string,
  ): Promise<StreamableFile> {
    const reporte = await this.obtenerReportePeriodo.ejecutar(periodoId);
    const buffer = await construirReporteExcel(reporte);
    return new StreamableFile(buffer, {
      disposition: `attachment; filename="${nombreArchivoReporteExcel(reporte)}"`,
    });
  }

  @Get('reportes/historico')
  @ApiOperation({
    summary: 'Gran total pagado por periodo en los últimos N meses',
  })
  @ApiResponse({ status: 200, type: [HistoricoPeriodoDto] })
  async historico(
    @Query() query: HistoricoQueryDto,
  ): Promise<HistoricoPeriodoDto[]> {
    const historico = await this.obtenerReporteHistorico.ejecutar(
      query.meses ?? MESES_HISTORICO_DEFAULT,
    );
    return historico.map(aHistoricoPeriodoDto);
  }
}
