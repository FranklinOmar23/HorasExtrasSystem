import { DomainError } from './domain.error';
export declare class FeriadoNoEncontradoError extends DomainError {
    readonly code = "FERIADO_NO_ENCONTRADO";
    readonly httpStatus = 404;
    constructor(id: string);
}
