import { DomainError } from './domain.error';
export declare class ImportacionYaConfirmadaError extends DomainError {
    readonly code = "IMPORTACION_YA_CONFIRMADA";
    readonly httpStatus = 409;
    constructor(id: string);
}
