import { DomainError } from './domain.error';
export declare class EmpleadoNoEncontradoError extends DomainError {
    readonly code = "EMPLEADO_NO_ENCONTRADO";
    constructor(id: string);
}
