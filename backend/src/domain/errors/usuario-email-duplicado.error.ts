import { DomainError } from './domain.error';

export class UsuarioEmailDuplicadoError extends DomainError {
  readonly code = 'USUARIO_EMAIL_DUPLICADO';
  readonly httpStatus = 409;

  constructor(email: string) {
    super(`Ya existe un usuario con el email ${email}.`);
  }
}
