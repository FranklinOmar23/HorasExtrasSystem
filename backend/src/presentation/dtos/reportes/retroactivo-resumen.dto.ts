import { ApiProperty } from '@nestjs/swagger';

export class RetroactivoResumenDto {
  @ApiProperty({ description: 'Cantidad de registros retroactivos incluidos en el periodo.' })
  dias!: number;

  @ApiProperty({ description: 'Monto total (RD$) de esos registros retroactivos.' })
  monto!: string;
}
