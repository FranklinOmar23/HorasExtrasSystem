import { ApiProperty } from '@nestjs/swagger';
import { CalculoRespuestaDto } from './calculo-respuesta.dto';

export class PreviewCalculoRespuestaDto {
  @ApiProperty({ type: [CalculoRespuestaDto] })
  calculos!: CalculoRespuestaDto[];

  @ApiProperty({
    description: 'true si la fecha cae fuera del rango del periodo indicado (se pagaría como retroactivo).',
  })
  esRetroactivo!: boolean;
}
