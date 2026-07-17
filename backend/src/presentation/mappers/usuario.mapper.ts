import { Usuario } from '../../domain/entities/usuario.entity';
import { UsuarioRespuestaDto } from '../dtos/usuarios/usuario-respuesta.dto';

export function aUsuarioRespuestaDto(usuario: Usuario): UsuarioRespuestaDto {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    activo: usuario.activo,
  };
}
