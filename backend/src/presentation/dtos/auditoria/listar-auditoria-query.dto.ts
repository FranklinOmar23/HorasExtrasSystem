import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
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

  @ApiPropertyOptional({ example: 1, description: '1-based. Default 1.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number;

  @ApiPropertyOptional({ example: 25, description: 'Default 25, máximo 100.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  porPagina?: number;
}
