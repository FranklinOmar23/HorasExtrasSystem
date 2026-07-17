import { Usuario } from '../../../domain/entities/usuario.entity';
import { RolUsuario } from '../../../domain/enums/rol-usuario.enum';
import { PasswordHasher } from '../../ports/password-hasher.port';
import { UsuarioRepository } from '../../ports/usuario.repository.port';
export interface CrearUsuarioComando {
    nombre: string;
    email: string;
    password: string;
    rol: RolUsuario;
}
export declare class CrearUsuarioUseCase {
    private readonly usuarioRepository;
    private readonly passwordHasher;
    constructor(usuarioRepository: UsuarioRepository, passwordHasher: PasswordHasher);
    ejecutar(comando: CrearUsuarioComando): Promise<Usuario>;
}
