import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, Matches } from 'class-validator';

export class SalarioInicialDto {
  @ApiProperty({
    example: '25000.00',
    description: 'Monto mensual en RD$, decimal con hasta 2 dígitos.',
  })
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'El monto mensual debe ser un decimal válido (ej: 25000.00).',
  })
  montoMensual!: string;

  @ApiProperty({ example: '2026-01-01' })
  @IsDateString()
  vigenteDesde!: string;
}
