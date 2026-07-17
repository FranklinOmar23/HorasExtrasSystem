import { ApiProperty } from '@nestjs/swagger';

export class EmpleadoReporteDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 40 })
  codigo!: number;

  @ApiProperty()
  nombre!: string;
}
