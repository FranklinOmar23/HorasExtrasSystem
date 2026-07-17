import { Usuario } from '../../../domain/entities/usuario.entity';
import { UsuarioRepository } from '../../ports/usuario.repository.port';
export declare class ListarUsuariosUseCase {
    private readonly usuarioRepository;
    constructor(usuarioRepository: UsuarioRepository);
    ejecutar(): Promise<Usuario[]>;
}
