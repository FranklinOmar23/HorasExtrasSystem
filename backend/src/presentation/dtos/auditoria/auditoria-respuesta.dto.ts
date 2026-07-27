import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccionAuditoria } from '../../../domain/enums/accion-auditoria.enum';
import { EntidadAuditoria } from '../../../domain/enums/entidad-auditoria.enum';

export class AuditoriaRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  usuarioId!: string;

  @ApiProperty({ example: 'Ana Pérez' })
  usuarioNombre!: string;

  @ApiProperty({ enum: AccionAuditoria })
  accion!: AccionAuditoria;

  @ApiProperty({ enum: EntidadAuditoria })
  entidad!: EntidadAuditoria;

  @ApiPropertyOptional({ nullable: true, example: null })
  entidadId!: string | null;

  @ApiProperty({ example: 'Eliminó el periodo 1-15 julio 2026.' })
  descripcion!: string;

  @ApiProperty()
  creadoEn!: string;
}
