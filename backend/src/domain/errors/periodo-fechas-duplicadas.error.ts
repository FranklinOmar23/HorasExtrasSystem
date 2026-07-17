import { DomainError } from './domain.error';

export class PeriodoFechasDuplicadasError extends DomainError {
  readonly code = 'PERIODO_FECHAS_DUPLICADAS';
  readonly httpStatus = 409;

  constructor(fechaInicio: string, fechaFin: string) {
    super(`Ya existe un periodo registrado del ${fechaInicio} al ${fechaFin}.`);
  }
}
