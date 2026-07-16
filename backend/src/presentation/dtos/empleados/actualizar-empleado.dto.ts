import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ActualizarEmpleadoDto {
  @ApiPropertyOptional({ example: 'Juana Pérez' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ example: '001-1234567-8' })
  @IsOptional()
  @IsString()
  cedula?: string;

  @ApiPropertyOptional({ example: 'Supervisora de línea' })
  @IsOptional()
  @IsString()
  posicion?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
