import { ApiProperty } from '@nestjs/swagger';
import { PeriodoRespuestaDto } from '../periodos/periodo-respuesta.dto';
import { DesgloseTipoHoraDto } from './desglose-tipo-hora.dto';
import { DiaReporteEmpleadoDto } from './dia-reporte-empleado.dto';
import { EmpleadoReporteDto } from './empleado-reporte.dto';

export class ReporteEmpleadoRespuestaDto {
  @ApiProperty({ type: PeriodoRespuestaDto })
  periodo!: PeriodoRespuestaDto;

  @ApiProperty({ type: EmpleadoReporteDto })
  empleado!: EmpleadoReporteDto;

  @ApiProperty()
  salarioHora!: string;

  @ApiProperty({ type: [DiaReporteEmpleadoDto] })
  dias!: DiaReporteEmpleadoDto[];

  @ApiProperty({ type: DesgloseTipoHoraDto })
  horas!: DesgloseTipoHoraDto;

  @ApiProperty({ type: DesgloseTipoHoraDto })
  montos!: DesgloseTipoHoraDto;

  @ApiProperty()
  total!: string;
}
