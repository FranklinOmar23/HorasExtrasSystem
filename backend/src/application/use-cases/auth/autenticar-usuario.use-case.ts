import { CredencialesInvalidasError } from '../../../domain/errors/credenciales-invalidas.error';
import { PasswordHasher } from '../../ports/password-hasher.port';
import { TokenService } from '../../ports/token.port';
import { UsuarioRepository } from '../../ports/usuario.repository.port';

export interface AutenticarUsuarioComando {
  email: string;
  password: string;
}

export interface AutenticarUsuarioResultado {
  accessToken: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
  };
}

export class AutenticarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async ejecutar(
    comando: AutenticarUsuarioComando,
  ): Promise<AutenticarUsuarioResultado> {
    const usuario = await this.usuarioRepository.buscarPorEmail(comando.email);
    if (!usuario || !usuario.activo) {
      throw new CredencialesInvalidasError();
    }

    const passwordValido = await this.passwordHasher.comparar(
      comando.password,
      usuario.passwordHash,
    );
    if (!passwordValido) {
      throw new CredencialesInvalidasError();
    }

    return {
      accessToken: this.tokenService.generar(usuario),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}
