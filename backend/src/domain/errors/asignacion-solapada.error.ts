import { DomainError } from './domain.error';

export class AsignacionSolapadaError extends DomainError {
  readonly code = 'ASIGNACION_SOLAPADA';
  readonly httpStatus = 409;

  constructor(empleadoId: string) {
    super(
      `El empleado ${empleadoId} ya tiene una asignación de turno que se solapa con ese rango de fechas.`,
    );
  }
}
