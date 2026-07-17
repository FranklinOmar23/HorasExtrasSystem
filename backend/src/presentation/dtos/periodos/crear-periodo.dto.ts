import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CrearPeriodoDto {
  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  fechaInicio!: string;

  @ApiProperty({ example: '2026-08-15' })
  @IsDateString()
  fechaFin!: string;
}
