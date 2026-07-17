import { DomainError } from './domain.error';
export declare class TipoHoraExtraNoEncontradoError extends DomainError {
    readonly code = "TIPO_HORA_EXTRA_NO_ENCONTRADO";
    readonly httpStatus = 404;
    constructor(id: string);
}
