import { DomainError } from './domain.error';
export declare class CredencialesInvalidasError extends DomainError {
    readonly code = "CREDENCIALES_INVALIDAS";
    constructor();
}
