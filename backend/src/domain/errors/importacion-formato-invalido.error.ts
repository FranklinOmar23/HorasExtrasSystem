import { DomainError } from './domain.error';

export class ImportacionFormatoInvalidoError extends DomainError {
  readonly code = 'IMPORTACION_FORMATO_INVALIDO';
  readonly httpStatus = 422;

  constructor(detalle: string) {
    super(`El archivo de importación no tiene un formato válido: ${detalle}`);
  }
}
