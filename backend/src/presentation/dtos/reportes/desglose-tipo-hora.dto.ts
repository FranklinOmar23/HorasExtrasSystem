import { ApiProperty } from '@nestjs/swagger';

export class DesgloseTipoHoraDto {
  @ApiProperty()
  he35!: string;

  @ApiProperty()
  he100!: string;

  @ApiProperty()
  nocturna!: string;

  @ApiProperty()
  feriado!: string;
}
