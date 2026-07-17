import { Usuario } from '../../../domain/entities/usuario.entity';
import { RolUsuario } from '../../../domain/enums/rol-usuario.enum';
import { UsuarioNoEncontradoError } from '../../../domain/errors/usuario-no-encontrado.error';
import { PasswordHasher } from '../../ports/password-hasher.port';
import { UsuarioRepository } from '../../ports/usuario.repository.port';

export interface ActualizarUsuarioComando {
  nombre?: string;
  rol?: RolUsuario;
  activo?: boolean;
  password?: string;
}

export class ActualizarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async ejecutar(
    id: string,
    comando: ActualizarUsuarioComando,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) {
      throw new UsuarioNoEncontradoError(id);
    }

    const passwordHash = comando.password
      ? await this.passwordHasher.hashear(comando.password)
      : undefined;

    return this.usuarioRepository.actualizar(id, {
      nombre: comando.nombre,
      rol: comando.rol,
      activo: comando.activo,
      passwordHash,
    });
  }
}
