import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmpleadoRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  codigo!: string;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional({ nullable: true })
  cargo!: string | null;

  @ApiProperty()
  activo!: boolean;
}
