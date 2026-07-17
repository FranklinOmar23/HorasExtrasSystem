import { DomainError } from './domain.error';

export class ImportacionNoEncontradaError extends DomainError {
  readonly code = 'IMPORTACION_NO_ENCONTRADA';
  readonly httpStatus = 404;

  constructor(id: string) {
    super(`No se encontró la importación ${id}.`);
  }
}
