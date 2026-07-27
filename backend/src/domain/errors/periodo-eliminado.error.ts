import { DomainError } from './domain.error';

export class PeriodoEliminadoError extends DomainError {
  readonly code = 'PERIODO_ELIMINADO';
  readonly httpStatus = 409;

  constructor(periodoId: string) {
    super(`El periodo ${periodoId} fue eliminado y no puede modificarse.`);
  }
}
