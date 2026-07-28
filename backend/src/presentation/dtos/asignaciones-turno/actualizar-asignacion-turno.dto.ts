import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class ActualizarAsignacionTurnoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  turnoId?: string;

  @ApiPropertyOptional({ example: '2026-08-01' })
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  /** Enviar `null` explícito vuelve la asignación indefinida (sin fecha de fin). */
  @ApiPropertyOptional({ example: '2026-08-31', nullable: true })
  @IsOptional()
  @IsDateString()
  fechaHasta?: string | null;

  @ApiPropertyOptional({ example: 'Refuerzo por temporada alta' })
  @IsOptional()
  @IsString()
  comentario?: string | null;
}
