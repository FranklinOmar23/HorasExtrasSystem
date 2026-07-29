import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ConfirmarImportacionDto {
  @ApiProperty({
    description:
      'Si es true, también persiste las filas con advertencias (no solo las OK).',
  })
  @IsBoolean()
  incluirAdvertencias!: boolean;

  @ApiPropertyOptional({
    description:
      'Si es true (default), también persiste las filas retroactivas (fecha fuera del periodo).',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  incluirRetroactivas?: boolean;
}
