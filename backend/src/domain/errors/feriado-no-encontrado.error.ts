import { DomainError } from './domain.error';

export class FeriadoNoEncontradoError extends DomainError {
  readonly code = 'FERIADO_NO_ENCONTRADO';
  readonly httpStatus = 404;

  constructor(id: string) {
    super(`No se encontró el feriado ${id}.`);
  }
}
