import { DomainError } from './domain.error';

export class FeriadoFechaDuplicadaError extends DomainError {
  readonly code = 'FERIADO_FECHA_DUPLICADA';
  readonly httpStatus = 409;

  constructor(fecha: string) {
    super(`Ya existe un feriado registrado en la fecha ${fecha}.`);
  }
}
