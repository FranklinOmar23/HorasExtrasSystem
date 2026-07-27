import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PeriodoRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: '2026-08-01' })
  fechaInicio!: string;

  @ApiProperty({ example: '2026-08-15' })
  fechaFin!: string;

  @ApiProperty({ enum: ['ABIERTO', 'CERRADO'] })
  estado!: string;

  @ApiPropertyOptional({ nullable: true, example: null })
  cerradoEn!: string | null;

  @ApiPropertyOptional({ nullable: true, example: null })
  cerradoPorId!: string | null;

  @ApiPropertyOptional({ nullable: true, example: null })
  eliminadoEn!: string | null;

  @ApiPropertyOptional({ nullable: true, example: null })
  eliminadoPorId!: string | null;
}
