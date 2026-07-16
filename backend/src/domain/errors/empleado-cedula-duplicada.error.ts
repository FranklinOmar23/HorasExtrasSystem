import { DomainError } from './domain.error';

export class EmpleadoCedulaDuplicadaError extends DomainError {
  readonly code = 'EMPLEADO_CEDULA_DUPLICADA';

  constructor(cedula: string) {
    super(`Ya existe un empleado con la cédula ${cedula}.`);
  }
}
