import { DomainError } from './domain.error';
export declare class EmpleadoCedulaDuplicadaError extends DomainError {
    readonly code = "EMPLEADO_CEDULA_DUPLICADA";
    constructor(cedula: string);
}
