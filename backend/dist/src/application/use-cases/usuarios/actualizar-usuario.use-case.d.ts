import { Usuario } from '../../../domain/entities/usuario.entity';
import { RolUsuario } from '../../../domain/enums/rol-usuario.enum';
import { PasswordHasher } from '../../ports/password-hasher.port';
import { UsuarioRepository } from '../../ports/usuario.repository.port';
export interface ActualizarUsuarioComando {
    nombre?: string;
    rol?: RolUsuario;
    activo?: boolean;
    password?: string;
}
export declare class ActualizarUsuarioUseCase {
    private readonly usuarioRepository;
    private readonly passwordHasher;
    constructor(usuarioRepository: UsuarioRepository, passwordHasher: PasswordHasher);
    ejecutar(id: string, comando: ActualizarUsuarioComando): Promise<Usuario>;
}
