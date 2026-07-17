import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class ActualizarTipoHoraExtraDto {
  @ApiPropertyOptional({ example: 'Hora extra 35%' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ example: '35.00' })
  @IsOptional()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'El porcentaje debe ser un decimal válido (ej: 35.00).',
  })
  porcentaje?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
