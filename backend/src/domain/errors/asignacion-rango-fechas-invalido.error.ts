import { DomainError } from './domain.error';

export class AsignacionRangoFechasInvalidoError extends DomainError {
  readonly code = 'ASIGNACION_RANGO_FECHAS_INVALIDO';
  readonly httpStatus = 400;

  constructor() {
    super('La fecha hasta no puede ser anterior a la fecha desde.');
  }
}
