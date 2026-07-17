import { ApiProperty } from '@nestjs/swagger';
import { RolUsuario } from '../../../domain/enums/rol-usuario.enum';

/** NUNCA incluye passwordHash: esta es la única forma en que un usuario sale de la API. */
export class UsuarioRespuestaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: RolUsuario })
  rol!: RolUsuario;

  @ApiProperty()
  activo!: boolean;
}
