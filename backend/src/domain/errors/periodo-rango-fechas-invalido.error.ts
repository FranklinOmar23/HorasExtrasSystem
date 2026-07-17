import { DomainError } from './domain.error';

export class PeriodoRangoFechasInvalidoError extends DomainError {
  readonly code = 'PERIODO_RANGO_FECHAS_INVALIDO';
  readonly httpStatus = 400;

  constructor() {
    super('La fecha de fin debe ser posterior o igual a la fecha de inicio.');
  }
}
