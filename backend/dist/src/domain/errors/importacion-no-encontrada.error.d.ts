import { DomainError } from './domain.error';
export declare class ImportacionNoEncontradaError extends DomainError {
    readonly code = "IMPORTACION_NO_ENCONTRADA";
    readonly httpStatus = 404;
    constructor(id: string);
}
