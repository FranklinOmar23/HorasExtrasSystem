import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { EntidadAuditoria } from '../../../domain/enums/entidad-auditoria.enum';

export class ListarAuditoriaQueryDto {
  @ApiPropertyOptional({ enum: EntidadAuditoria })
  @IsOptional()
  @IsEnum(EntidadAuditoria)
  entidad?: EntidadAuditoria;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @ApiPropertyOptional({ example: '2026-07-01' })
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiPropertyOptional({ example: '2026-07-31' })
  @IsOptional()
  @IsDateString()
  hasta?: string;
}
