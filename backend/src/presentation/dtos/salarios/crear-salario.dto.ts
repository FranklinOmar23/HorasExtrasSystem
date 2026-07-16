import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, Matches } from 'class-validator';

export class CrearSalarioDto {
  @ApiProperty({ example: '27000.00' })
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'El monto mensual debe ser un decimal válido (ej: 27000.00).',
  })
  montoMensual!: string;

  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  vigenteDesde!: string;
}
