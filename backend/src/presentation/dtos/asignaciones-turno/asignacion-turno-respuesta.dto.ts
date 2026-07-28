import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AsignacionTurnoRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  empleadoId!: string;

  @ApiProperty()
  turnoId!: string;

  @ApiProperty({ example: '2026-08-01' })
  fechaDesde!: string;

  @ApiPropertyOptional({ example: '2026-08-31', nullable: true })
  fechaHasta!: string | null;

  @ApiPropertyOptional({ nullable: true })
  comentario!: string | null;

  @ApiProperty()
  creadoPorId!: string;

  @ApiProperty()
  createdAt!: string;
}
