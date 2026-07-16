import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmpleadoRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 40 })
  codigo!: number;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional({ nullable: true, example: '001-1234567-8' })
  cedula!: string | null;

  @ApiProperty()
  posicion!: string;

  @ApiProperty()
  activo!: boolean;
}
