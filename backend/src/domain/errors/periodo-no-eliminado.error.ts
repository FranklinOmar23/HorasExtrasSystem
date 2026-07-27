import { DomainError } from './domain.error';

export class PeriodoNoEliminadoError extends DomainError {
  readonly code = 'PERIODO_NO_ELIMINADO';
  readonly httpStatus = 409;

  constructor(periodoId: string) {
    super(`El periodo ${periodoId} no está eliminado.`);
  }
}
