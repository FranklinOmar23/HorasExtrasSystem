import { DomainError } from './domain.error';
export declare class RegistroHorasNoEncontradoError extends DomainError {
    readonly code = "REGISTRO_HORAS_NO_ENCONTRADO";
    readonly httpStatus = 404;
    constructor(id: string);
}
