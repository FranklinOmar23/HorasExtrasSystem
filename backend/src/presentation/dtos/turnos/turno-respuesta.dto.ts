import { ApiProperty } from '@nestjs/swagger';

export class TurnoRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'NOCTURNO' })
  codigo!: string;

  @ApiProperty({ example: 'Nocturno' })
  nombre!: string;

  @ApiProperty({ example: '22:00' })
  horaInicio!: string;

  @ApiProperty({ example: '08:00' })
  horaFin!: string;

  @ApiProperty({ example: '8.00' })
  horasJornada!: string;

  @ApiProperty()
  cruzaMedianoche!: boolean;

  @ApiProperty()
  descuentaAlmuerzo!: boolean;

  @ApiProperty()
  activo!: boolean;
}
