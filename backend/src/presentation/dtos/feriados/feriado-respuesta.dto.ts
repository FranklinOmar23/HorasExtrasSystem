import { ApiProperty } from '@nestjs/swagger';

export class FeriadoRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: '2026-02-27' })
  fecha!: string;

  @ApiProperty({ example: 'Día de la Independencia' })
  descripcion!: string;
}
