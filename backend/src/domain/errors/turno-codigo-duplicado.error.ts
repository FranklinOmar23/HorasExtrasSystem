import { DomainError } from './domain.error';

export class TurnoCodigoDuplicadoError extends DomainError {
  readonly code = 'TURNO_CODIGO_DUPLICADO';
  readonly httpStatus = 409;

  constructor(codigo: string) {
    super(`Ya existe un turno con código ${codigo}.`);
  }
}
