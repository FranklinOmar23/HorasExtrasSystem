import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SalarioInicialDto } from './salario-inicial.dto';

export class CrearEmpleadoDto {
  @ApiProperty({ example: 40 })
  @IsInt()
  @IsPositive()
  codigo!: number;

  @ApiProperty({ example: 'Juana Pérez' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del empleado es obligatorio.' })
  nombre!: string;

  @ApiPropertyOptional({ example: '001-1234567-8' })
  @IsOptional()
  @IsString()
  cedula?: string;

  @ApiProperty({ example: 'Supervisora de línea' })
  @IsString()
  @IsNotEmpty({ message: 'La posición del empleado es obligatoria.' })
  posicion!: string;

  @ApiProperty({ type: SalarioInicialDto })
  @ValidateNested()
  @Type(() => SalarioInicialDto)
  salarioInicial!: SalarioInicialDto;
}
