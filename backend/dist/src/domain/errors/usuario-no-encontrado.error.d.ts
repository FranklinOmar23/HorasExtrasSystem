import { DomainError } from './domain.error';
export declare class UsuarioNoEncontradoError extends DomainError {
    readonly code = "USUARIO_NO_ENCONTRADO";
    readonly httpStatus = 404;
    constructor(id: string);
}
