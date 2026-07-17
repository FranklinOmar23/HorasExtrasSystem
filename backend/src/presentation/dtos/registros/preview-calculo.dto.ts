import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID, Matches } from 'class-validator';

const FORMATO_HORA = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class PreviewCalculoDto {
  @ApiProperty()
  @IsUUID()
  empleadoId!: string;

  @ApiProperty({ example: '2026-08-05' })
  @IsDateString()
  fecha!: string;

  @ApiProperty({ example: '08:30' })
  @Matches(FORMATO_HORA, {
    message: 'La hora de entrada debe tener formato HH:mm.',
  })
  horaEntrada!: string;

  @ApiProperty({ example: '19:00' })
  @Matches(FORMATO_HORA, {
    message: 'La hora de salida debe tener formato HH:mm.',
  })
  horaSalida!: string;
}
