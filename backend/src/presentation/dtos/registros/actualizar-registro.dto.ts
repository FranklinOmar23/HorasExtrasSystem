import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';

const FORMATO_HORA = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class ActualizarRegistroDto {
  @ApiPropertyOptional({ example: '2026-08-05' })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiPropertyOptional({ example: '08:30' })
  @IsOptional()
  @Matches(FORMATO_HORA, { message: 'La hora de entrada debe tener formato HH:mm.' })
  horaEntrada?: string;

  @ApiPropertyOptional({ example: '19:00' })
  @IsOptional()
  @Matches(FORMATO_HORA, { message: 'La hora de salida debe tener formato HH:mm.' })
  horaSalida?: string;

  @ApiPropertyOptional({ example: 'Corrección de salida' })
  @IsOptional()
  @IsString()
  comentario?: string;
}
