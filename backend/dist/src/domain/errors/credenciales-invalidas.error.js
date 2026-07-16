"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredencialesInvalidasError = void 0;
const domain_error_1 = require("./domain.error");
class CredencialesInvalidasError extends domain_error_1.DomainError {
    code = 'CREDENCIALES_INVALIDAS';
    constructor() {
        super('El correo o la contraseña son incorrectos.');
    }
}
exports.CredencialesInvalidasError = CredencialesInvalidasError;
//# sourceMappingURL=credenciales-invalidas.error.js.map