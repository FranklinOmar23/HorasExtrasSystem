import { DomainError } from './domain.error';

export class SalarioNoVigenteError extends DomainError {
  readonly code = 'SALARIO_NO_VIGENTE';
  readonly httpStatus = 422;

  constructor(empleadoId: string, fecha: string) {
    super(
      `El empleado ${empleadoId} no tiene un salario vigente en la fecha ${fecha}.`,
    );
  }
}
