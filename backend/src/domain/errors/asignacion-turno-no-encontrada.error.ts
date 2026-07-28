import { DomainError } from './domain.error';

export class AsignacionTurnoNoEncontradaError extends DomainError {
  readonly code = 'ASIGNACION_TURNO_NO_ENCONTRADA';
  readonly httpStatus = 404;

  constructor(id: string) {
    super(`No se encontró la asignación de turno ${id}.`);
  }
}
