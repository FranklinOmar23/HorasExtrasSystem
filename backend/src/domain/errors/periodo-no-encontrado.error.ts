import { DomainError } from './domain.error';

export class PeriodoNoEncontradoError extends DomainError {
  readonly code = 'PERIODO_NO_ENCONTRADO';
  readonly httpStatus = 404;

  constructor(id: string) {
    super(`No se encontró el periodo ${id}.`);
  }
}
