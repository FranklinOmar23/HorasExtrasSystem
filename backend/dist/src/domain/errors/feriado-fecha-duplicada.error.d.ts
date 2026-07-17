import { DomainError } from './domain.error';
export declare class FeriadoFechaDuplicadaError extends DomainError {
    readonly code = "FERIADO_FECHA_DUPLICADA";
    readonly httpStatus = 409;
    constructor(fecha: string);
}
