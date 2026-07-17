import { ApiProperty } from '@nestjs/swagger';
import { PeriodoRespuestaDto } from '../periodos/periodo-respuesta.dto';

export class HistoricoPeriodoDto {
  @ApiProperty({ type: PeriodoRespuestaDto })
  periodo!: PeriodoRespuestaDto;

  @ApiProperty()
  granTotal!: string;
}
