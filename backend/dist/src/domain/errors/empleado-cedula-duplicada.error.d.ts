import { DomainError } from './domain.error';
export declare class EmpleadoCedulaDuplicadaError extends DomainError {
    readonly code = "EMPLEADO_CEDULA_DUPLICADA";
    readonly httpStatus = 409;
    constructor(cedula: string);
}
