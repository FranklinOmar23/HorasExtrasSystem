import { DomainError } from './domain.error';
export declare class ImportacionFormatoInvalidoError extends DomainError {
    readonly code = "IMPORTACION_FORMATO_INVALIDO";
    readonly httpStatus = 422;
    constructor(detalle: string);
}
