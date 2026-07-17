import { DomainError } from './domain.error';

export class ImportacionYaConfirmadaError extends DomainError {
  readonly code = 'IMPORTACION_YA_CONFIRMADA';
  readonly httpStatus = 409;

  constructor(id: string) {
    super(`La importación ${id} ya fue confirmada anteriormente.`);
  }
}
