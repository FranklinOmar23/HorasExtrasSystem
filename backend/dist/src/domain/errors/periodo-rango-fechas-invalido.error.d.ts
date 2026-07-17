import { DomainError } from './domain.error';
export declare class PeriodoRangoFechasInvalidoError extends DomainError {
    readonly code = "PERIODO_RANGO_FECHAS_INVALIDO";
    readonly httpStatus = 400;
    constructor();
}
