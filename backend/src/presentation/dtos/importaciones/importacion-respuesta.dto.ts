import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImportacionRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  periodoId!: string;

  @ApiProperty()
  usuarioId!: string;

  @ApiProperty()
  archivo!: string;

  @ApiProperty()
  filasOk!: number;

  @ApiProperty()
  filasAdvertencia!: number;

  @ApiProperty()
  filasError!: number;

  @ApiProperty()
  importadoEn!: string;

  @ApiPropertyOptional({ nullable: true })
  confirmadaEn!: string | null;
}
