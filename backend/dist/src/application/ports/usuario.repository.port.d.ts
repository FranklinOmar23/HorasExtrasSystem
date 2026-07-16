import { Usuario } from '../../domain/entities/usuario.entity';
export declare const USUARIO_REPOSITORY: unique symbol;
export interface UsuarioRepository {
    buscarPorEmail(email: string): Promise<Usuario | null>;
    buscarPorId(id: string): Promise<Usuario | null>;
}
