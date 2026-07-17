import { DomainError } from './domain.error';
export declare class SalarioNoVigenteError extends DomainError {
    readonly code = "SALARIO_NO_VIGENTE";
    readonly httpStatus = 422;
    constructor(empleadoId: string, fecha: string);
}
