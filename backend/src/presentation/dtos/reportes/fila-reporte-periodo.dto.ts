import { ApiProperty } from '@nestjs/swagger';
import { DesgloseTipoHoraDto } from './desglose-tipo-hora.dto';
import { EmpleadoReporteDto } from './empleado-reporte.dto';

export class FilaReportePeriodoDto {
  @ApiProperty({ type: EmpleadoReporteDto })
  empleado!: EmpleadoReporteDto;

  @ApiProperty()
  salarioHora!: string;

  @ApiProperty({ type: DesgloseTipoHoraDto })
  horas!: DesgloseTipoHoraDto;

  @ApiProperty({ type: DesgloseTipoHoraDto })
  montos!: DesgloseTipoHoraDto;

  @ApiProperty()
  total!: string;
}
