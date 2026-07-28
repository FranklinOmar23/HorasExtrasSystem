import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const FORMATO_HORA = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CrearTurnoDto {
  @ApiProperty({ example: 'NOCTURNO' })
  @IsString()
  @IsNotEmpty({ message: 'El código del turno es obligatorio.' })
  @MaxLength(20)
  codigo!: string;

  @ApiProperty({ example: 'Nocturno' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del turno es obligatorio.' })
  nombre!: string;

  @ApiProperty({ example: '22:00' })
  @Matches(FORMATO_HORA, { message: 'horaInicio debe tener formato HH:mm.' })
  horaInicio!: string;

  @ApiProperty({ example: '08:00' })
  @Matches(FORMATO_HORA, { message: 'horaFin debe tener formato HH:mm.' })
  horaFin!: string;

  @ApiProperty({ example: '8' })
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'horasJornada debe ser un decimal válido (ej: 8.00).',
  })
  horasJornada!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  cruzaMedianoche!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  descuentaAlmuerzo!: boolean;
}
