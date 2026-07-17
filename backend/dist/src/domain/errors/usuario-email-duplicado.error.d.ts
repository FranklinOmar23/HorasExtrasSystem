import { DomainError } from './domain.error';
export declare class UsuarioEmailDuplicadoError extends DomainError {
    readonly code = "USUARIO_EMAIL_DUPLICADO";
    readonly httpStatus = 409;
    constructor(email: string);
}
