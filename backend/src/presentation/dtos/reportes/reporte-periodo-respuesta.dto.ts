import { ApiProperty } from '@nestjs/swagger';
import { PeriodoRespuestaDto } from '../periodos/periodo-respuesta.dto';
import { FilaReportePeriodoDto } from './fila-reporte-periodo.dto';

export class ReportePeriodoRespuestaDto {
  @ApiProperty({ type: PeriodoRespuestaDto })
  periodo!: PeriodoRespuestaDto;

  @ApiProperty({ type: [FilaReportePeriodoDto] })
  filas!: FilaReportePeriodoDto[];

  @ApiProperty()
  granTotal!: string;
}
