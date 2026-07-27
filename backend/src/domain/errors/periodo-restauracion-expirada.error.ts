import { DomainError } from './domain.error';

export class PeriodoRestauracionExpiradaError extends DomainError {
  readonly code = 'PERIODO_RESTAURACION_EXPIRADA';
  readonly httpStatus = 409;

  constructor(periodoId: string, diasLimite: number) {
    super(
      `El periodo ${periodoId} fue eliminado hace más de ${diasLimite} días y ya no puede restaurarse.`,
    );
  }
}
