import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SalarioRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  empleadoId!: string;

  @ApiProperty({ example: '27000.00', description: 'Decimal como string.' })
  montoMensual!: string;

  @ApiProperty({ example: '2026-08-01' })
  vigenteDesde!: string;

  @ApiPropertyOptional({ nullable: true, example: null })
  vigenteHasta!: string | null;
}
