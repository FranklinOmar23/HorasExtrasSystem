import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CrearAsignacionTurnoDto {
  @ApiProperty()
  @IsUUID()
  empleadoId!: string;

  @ApiProperty()
  @IsUUID()
  turnoId!: string;

  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  fechaDesde!: string;

  @ApiPropertyOptional({ example: '2026-08-31', nullable: true })
  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @ApiPropertyOptional({ example: 'Refuerzo por temporada alta' })
  @IsOptional()
  @IsString()
  comentario?: string;
}
