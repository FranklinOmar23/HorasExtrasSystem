import { DomainError } from './domain.error';

export class EmpleadoCodigoDuplicadoError extends DomainError {
  readonly code = 'EMPLEADO_CODIGO_DUPLICADO';

  constructor(codigo: number) {
    super(`Ya existe un empleado con el código ${codigo}.`);
  }
}
