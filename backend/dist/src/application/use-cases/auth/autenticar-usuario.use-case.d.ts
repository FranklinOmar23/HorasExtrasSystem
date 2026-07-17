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
export declare class AutenticarUsuarioUseCase {
    private readonly usuarioRepository;
    private readonly passwordHasher;
    private readonly tokenService;
    constructor(usuarioRepository: UsuarioRepository, passwordHasher: PasswordHasher, tokenService: TokenService);
    ejecutar(comando: AutenticarUsuarioComando): Promise<AutenticarUsuarioResultado>;
}
