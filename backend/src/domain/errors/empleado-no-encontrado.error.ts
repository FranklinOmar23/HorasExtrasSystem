import { DomainError } from './domain.error';

export class EmpleadoNoEncontradoError extends DomainError {
  readonly code = 'EMPLEADO_NO_ENCONTRADO';

  constructor(id: string) {
    super(`No se encontró el empleado ${id}.`);
  }
}
