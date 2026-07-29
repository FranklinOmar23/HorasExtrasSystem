import { ApiProperty } from '@nestjs/swagger';
import { FilaImportacionRespuestaDto } from './fila-importacion-respuesta.dto';

export class ResumenImportacionDto {
  @ApiProperty()
  ok!: number;

  @ApiProperty()
  retroactivas!: number;

  @ApiProperty()
  advertencias!: number;

  @ApiProperty()
  errores!: number;
}

export class ParsearImportacionRespuestaDto {
  @ApiProperty()
  importacionId!: string;

  @ApiProperty({ type: [FilaImportacionRespuestaDto] })
  filas!: FilaImportacionRespuestaDto[];

  @ApiProperty({ type: ResumenImportacionDto })
  resumen!: ResumenImportacionDto;
}
