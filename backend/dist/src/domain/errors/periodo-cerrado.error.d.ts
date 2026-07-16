import { DomainError } from './domain.error';
export declare class PeriodoCerradoError extends DomainError {
    readonly code = "PERIODO_CERRADO";
    constructor(periodoId: string);
}
