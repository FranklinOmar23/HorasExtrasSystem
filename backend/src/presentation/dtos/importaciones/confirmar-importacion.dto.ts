import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ConfirmarImportacionDto {
  @ApiProperty({
    description:
      'Si es true, también persiste las filas con advertencias (no solo las OK).',
  })
  @IsBoolean()
  incluirAdvertencias!: boolean;
}
