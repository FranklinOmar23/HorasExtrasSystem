import { ApiProperty } from '@nestjs/swagger';

class UsuarioRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: ['ADMIN', 'RRHH'] })
  rol!: string;
}

export class LoginRespuestaDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ type: UsuarioRespuestaDto })
  usuario!: UsuarioRespuestaDto;
}
