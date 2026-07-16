import { DomainError } from './domain.error';

export class CredencialesInvalidasError extends DomainError {
  readonly code = 'CREDENCIALES_INVALIDAS';

  constructor() {
    super('El correo o la contraseña son incorrectos.');
  }
}
