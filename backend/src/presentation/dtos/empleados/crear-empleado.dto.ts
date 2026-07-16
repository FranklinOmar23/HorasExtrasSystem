import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CrearEmpleadoDto {
  @ApiProperty({ example: 'EMP-001' })
  @IsString()
  @IsNotEmpty({ message: 'El código del empleado es obligatorio.' })
  codigo!: string;

  @ApiProperty({ example: 'Juana Pérez' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del empleado es obligatorio.' })
  nombre!: string;

  @ApiPropertyOptional({ example: 'Supervisora de línea' })
  @IsOptional()
  @IsString()
  cargo?: string;
}
