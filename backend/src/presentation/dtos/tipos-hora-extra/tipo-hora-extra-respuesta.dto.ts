import { ApiProperty } from '@nestjs/swagger';

export class TipoHoraExtraRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'HE_35' })
  codigo!: string;

  @ApiProperty({ example: 'Hora extra 35%' })
  nombre!: string;

  @ApiProperty({ example: '35.00' })
  porcentaje!: string;

  @ApiProperty()
  activo!: boolean;
}
