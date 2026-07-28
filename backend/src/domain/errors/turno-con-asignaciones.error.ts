import { DomainError } from './domain.error';

export class TurnoConAsignacionesError extends DomainError {
  readonly code = 'TURNO_CON_ASIGNACIONES';
  readonly httpStatus = 409;

  constructor(id: string) {
    super(`El turno ${id} tiene asignaciones registradas y no puede eliminarse.`);
  }
}
