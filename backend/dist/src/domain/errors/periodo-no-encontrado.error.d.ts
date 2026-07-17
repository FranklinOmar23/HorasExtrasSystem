import { DomainError } from './domain.error';
export declare class PeriodoNoEncontradoError extends DomainError {
    readonly code = "PERIODO_NO_ENCONTRADO";
    readonly httpStatus = 404;
    constructor(id: string);
}
