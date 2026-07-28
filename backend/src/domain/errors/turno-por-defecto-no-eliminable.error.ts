import { DomainError } from './domain.error';

export class TurnoPorDefectoNoEliminableError extends DomainError {
  readonly code = 'TURNO_POR_DEFECTO_NO_ELIMINABLE';
  readonly httpStatus = 409;

  constructor(codigo: string) {
    super(
      `El turno ${codigo} es uno de los turnos por defecto del sistema y no puede eliminarse.`,
    );
  }
}
