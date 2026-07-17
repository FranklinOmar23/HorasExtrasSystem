import { Usuario } from '../../../domain/entities/usuario.entity';
import { RolUsuario } from '../../../domain/enums/rol-usuario.enum';
import { UsuarioEmailDuplicadoError } from '../../../domain/errors/usuario-email-duplicado.error';
import { PasswordHasher } from '../../ports/password-hasher.port';
import { UsuarioRepository } from '../../ports/usuario.repository.port';

export interface CrearUsuarioComando {
  nombre: string;
  email: string;
  password: string;
  rol: RolUsuario;
}

export class CrearUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async ejecutar(comando: CrearUsuarioComando): Promise<Usuario> {
    const existente = await this.usuarioRepository.buscarPorEmail(
      comando.email,
    );
    if (existente) {
      throw new UsuarioEmailDuplicadoError(comando.email);
    }

    const passwordHash = await this.passwordHasher.hashear(comando.password);

    return this.usuarioRepository.crear({
      nombre: comando.nombre,
      email: comando.email,
      passwordHash,
      rol: comando.rol,
    });
  }
}
