import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmpleadoListaRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 40 })
  codigo!: number;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional({ nullable: true, example: '001-1234567-8' })
  cedula!: string | null;

  @ApiProperty()
  posicion!: string;

  @ApiProperty()
  activo!: boolean;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Salario mensual vigente (null si el empleado no tiene ninguno registrado).',
  })
  montoMensualVigente!: string | null;
}

export class EmpleadosPaginadosRespuestaDto {
  @ApiProperty({ type: [EmpleadoListaRespuestaDto] })
  items!: EmpleadoListaRespuestaDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  pagina!: number;

  @ApiProperty()
  porPagina!: number;

  @ApiProperty()
  totalPaginas!: number;
}
