import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CalculoRespuestaDto } from './calculo-respuesta.dto';

export class RegistroRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  periodoId!: string;

  @ApiProperty()
  empleadoId!: string;

  @ApiProperty({ example: '2026-08-05' })
  fecha!: string;

  @ApiProperty({ example: '08:30' })
  horaEntrada!: string;

  @ApiProperty({ example: '19:00' })
  horaSalida!: string;

  @ApiProperty({ enum: ['EXCEL', 'MANUAL'] })
  origen!: string;

  @ApiPropertyOptional({ nullable: true })
  comentario!: string | null;

  @ApiProperty({ type: [CalculoRespuestaDto] })
  calculos!: CalculoRespuestaDto[];

  @ApiProperty({
    description: 'true si la fecha cae fuera del rango del periodo al que está adjunto (horas pendientes pagadas retroactivamente).',
  })
  esRetroactivo!: boolean;
}
