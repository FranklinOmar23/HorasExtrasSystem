import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CrearFeriadoDto {
  @ApiProperty({ example: '2026-02-27' })
  @IsDateString()
  fecha!: string;

  @ApiProperty({ example: 'Día de la Independencia' })
  @IsString()
  @IsNotEmpty({ message: 'La descripción del feriado es obligatoria.' })
  descripcion!: string;
}
