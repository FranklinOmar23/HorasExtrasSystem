import { ApiProperty } from '@nestjs/swagger';
import { CalculoRespuestaDto } from '../registros/calculo-respuesta.dto';

export class DiaReporteEmpleadoDto {
  @ApiProperty({ example: '2026-08-05' })
  fecha!: string;

  @ApiProperty({ example: '08:30' })
  horaEntrada!: string;

  @ApiProperty({ example: '19:00' })
  horaSalida!: string;

  @ApiProperty({ example: 'NOCTURNO' })
  turnoCodigo!: string;

  @ApiProperty({ example: 'Nocturno' })
  turnoNombre!: string;

  @ApiProperty({ type: [CalculoRespuestaDto] })
  calculos!: CalculoRespuestaDto[];

  @ApiProperty()
  total!: string;
}
