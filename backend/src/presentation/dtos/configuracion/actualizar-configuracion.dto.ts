import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ActualizarConfiguracionDto {
  @ApiPropertyOptional({ example: '23.83' })
  @IsOptional()
  @IsString()
  divisor_salario?: string;

  @ApiPropertyOptional({ example: '8' })
  @IsOptional()
  @IsString()
  horas_jornada?: string;

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsString()
  horas_almuerzo?: string;

  @ApiPropertyOptional({ example: '08:30' })
  @IsOptional()
  @IsString()
  entrada_semana?: string;

  @ApiPropertyOptional({ example: '17:30' })
  @IsOptional()
  @IsString()
  salida_semana?: string;

  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @IsString()
  entrada_sabado?: string;

  @ApiPropertyOptional({ example: '13:00' })
  @IsOptional()
  @IsString()
  salida_sabado?: string;

  @ApiPropertyOptional({ example: '21:00' })
  @IsOptional()
  @IsString()
  inicio_nocturna?: string;

  @ApiPropertyOptional({ example: '0' })
  @IsOptional()
  @IsString()
  tolerancia_minutos?: string;

  @ApiPropertyOptional({ example: 'ninguno' })
  @IsOptional()
  @IsString()
  redondeo?: string;
}
