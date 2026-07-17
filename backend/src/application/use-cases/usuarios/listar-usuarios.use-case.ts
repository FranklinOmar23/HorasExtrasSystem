import { Usuario } from '../../../domain/entities/usuario.entity';
import { UsuarioRepository } from '../../ports/usuario.repository.port';

export class ListarUsuariosUseCase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  ejecutar(): Promise<Usuario[]> {
    return this.usuarioRepository.listar();
  }
}
