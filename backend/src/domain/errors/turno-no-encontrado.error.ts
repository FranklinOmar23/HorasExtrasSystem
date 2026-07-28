import { DomainError } from './domain.error';

export class TurnoNoEncontradoError extends DomainError {
  readonly code = 'TURNO_NO_ENCONTRADO';
  readonly httpStatus = 404;

  constructor(idOCodigo: string) {
    super(`No se encontró el turno ${idOCodigo}.`);
  }
}
