import { DomainError } from './domain.error';

export class RegistroHorasNoEncontradoError extends DomainError {
  readonly code = 'REGISTRO_HORAS_NO_ENCONTRADO';
  readonly httpStatus = 404;

  constructor(id: string) {
    super(`No se encontró el registro de horas ${id}.`);
  }
}
