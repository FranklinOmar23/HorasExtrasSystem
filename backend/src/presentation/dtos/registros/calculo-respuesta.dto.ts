import { ApiProperty } from '@nestjs/swagger';

export class CalculoRespuestaDto {
  @ApiProperty({ enum: ['HE_35', 'HE_100', 'NOCTURNA_15', 'FERIADO'] })
  tipoHoraCodigo!: string;

  @ApiProperty({ example: '2.0000' })
  cantidadHoras!: string;

  @ApiProperty({ example: '35.00' })
  porcentajeAplicado!: string;

  @ApiProperty({ example: '117.5000' })
  salarioHoraUsado!: string;

  @ApiProperty({ example: '317.25' })
  monto!: string;
}
