import { DomainError } from './domain.error';

export class TipoHoraExtraNoEncontradoError extends DomainError {
  readonly code = 'TIPO_HORA_EXTRA_NO_ENCONTRADO';
  readonly httpStatus = 404;

  constructor(id: string) {
    super(`No se encontró el tipo de hora extra ${id}.`);
  }
}
