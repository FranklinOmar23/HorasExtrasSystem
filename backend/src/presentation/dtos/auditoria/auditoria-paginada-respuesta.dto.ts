import { ApiProperty } from '@nestjs/swagger';
import { AuditoriaRespuestaDto } from './auditoria-respuesta.dto';

export class AuditoriaPaginadaRespuestaDto {
  @ApiProperty({ type: [AuditoriaRespuestaDto] })
  items!: AuditoriaRespuestaDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  pagina!: number;

  @ApiProperty()
  porPagina!: number;

  @ApiProperty()
  totalPaginas!: number;
}
