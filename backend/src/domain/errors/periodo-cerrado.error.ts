import { DomainError } from './domain.error';

export class PeriodoCerradoError extends DomainError {
  readonly code = 'PERIODO_CERRADO';
  readonly httpStatus = 409;

  constructor(periodoId: string) {
    super(`El periodo ${periodoId} está cerrado y no puede modificarse.`);
  }
}
