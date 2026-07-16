import { DomainError } from './domain.error';
export declare class EmpleadoCodigoDuplicadoError extends DomainError {
    readonly code = "EMPLEADO_CODIGO_DUPLICADO";
    constructor(codigo: number);
}
