import { DomainError } from './domain.error';
export declare class PeriodoFechasDuplicadasError extends DomainError {
    readonly code = "PERIODO_FECHAS_DUPLICADAS";
    readonly httpStatus = 409;
    constructor(fechaInicio: string, fechaFin: string);
}
