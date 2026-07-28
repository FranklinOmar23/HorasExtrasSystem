import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

const FORMATO_HORA = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class ActualizarTurnoDto {
  @ApiPropertyOptional({ example: 'Nocturno' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ example: '22:00' })
  @IsOptional()
  @Matches(FORMATO_HORA, { message: 'horaInicio debe tener formato HH:mm.' })
  horaInicio?: string;

  @ApiPropertyOptional({ example: '08:00' })
  @IsOptional()
  @Matches(FORMATO_HORA, { message: 'horaFin debe tener formato HH:mm.' })
  horaFin?: string;

  @ApiPropertyOptional({ example: '8' })
  @IsOptional()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'horasJornada debe ser un decimal válido (ej: 8.00).',
  })
  horasJornada?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  cruzaMedianoche?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  descuentaAlmuerzo?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
