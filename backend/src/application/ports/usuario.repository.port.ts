import { Usuario } from '../../domain/entities/usuario.entity';

export const USUARIO_REPOSITORY = Symbol('USUARIO_REPOSITORY');

export interface UsuarioRepository {
  buscarPorEmail(email: string): Promise<Usuario | null>;
  buscarPorId(id: string): Promise<Usuario | null>;
}
