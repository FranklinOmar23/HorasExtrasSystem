import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoFilaImportacion } from '../../../domain/enums/estado-fila-importacion.enum';

export class FilaImportacionRespuestaDto {
  @ApiProperty({ description: 'Número de fila en el Excel (1 = encabezado).' })
  linea!: number;

  @ApiPropertyOptional({ nullable: true, example: '2026-08-05' })
  fecha!: string | null;

  @ApiPropertyOptional({ nullable: true })
  codigo!: number | null;

  @ApiPropertyOptional({ nullable: true })
  nombre!: string | null;

  @ApiPropertyOptional({ nullable: true, example: '08:30' })
  entrada!: string | null;

  @ApiPropertyOptional({ nullable: true, example: '19:00' })
  salida!: string | null;

  @ApiProperty({ enum: EstadoFilaImportacion })
  estado!: EstadoFilaImportacion;

  @ApiProperty({ type: [String] })
  mensajes!: string[];
}
