import { ApiProperty } from '@nestjs/swagger';

export class ConfiguracionRespuestaDto {
  @ApiProperty({ example: '23.83' })
  divisor_salario!: string;

  @ApiProperty({ example: '8' })
  horas_jornada!: string;

  @ApiProperty({ example: '1' })
  horas_almuerzo!: string;

  @ApiProperty({ example: '08:30' })
  entrada_semana!: string;

  @ApiProperty({ example: '17:30' })
  salida_semana!: string;

  @ApiProperty({ example: '09:00' })
  entrada_sabado!: string;

  @ApiProperty({ example: '13:00' })
  salida_sabado!: string;

  @ApiProperty({ example: '21:00' })
  inicio_nocturna!: string;

  @ApiProperty({ example: '07:00' })
  fin_nocturna!: string;

  @ApiProperty({ example: '0' })
  tolerancia_minutos!: string;

  @ApiProperty({ example: 'ninguno' })
  redondeo!: string;
}
