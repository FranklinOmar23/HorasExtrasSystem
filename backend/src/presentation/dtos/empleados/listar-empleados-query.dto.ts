import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ListarEmpleadosQueryDto {
  @ApiPropertyOptional({
    description: 'Busca por código exacto, o por coincidencia en nombre/cédula.',
    example: 'Pérez',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ example: 25000, description: 'Salario mensual vigente mínimo.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salarioMin?: number;

  @ApiPropertyOptional({ example: 45000, description: 'Salario mensual vigente máximo.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salarioMax?: number;

  @ApiPropertyOptional({ example: 1, description: '1-based. Default 1.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number;

  @ApiPropertyOptional({ example: 25, description: 'Default 25, máximo 500.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  porPagina?: number;
}
