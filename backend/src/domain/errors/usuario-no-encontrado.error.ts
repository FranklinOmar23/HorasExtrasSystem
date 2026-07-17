import { DomainError } from './domain.error';

export class UsuarioNoEncontradoError extends DomainError {
  readonly code = 'USUARIO_NO_ENCONTRADO';
  readonly httpStatus = 404;

  constructor(id: string) {
    super(`No se encontró el usuario ${id}.`);
  }
}
