import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class HistoricoQueryDto {
  @ApiPropertyOptional({
    example: 6,
    description: 'Meses hacia atrás desde hoy (default 6).',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(60)
  meses?: number;
}
