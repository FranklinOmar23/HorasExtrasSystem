"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioEmailDuplicadoError = void 0;
const domain_error_1 = require("./domain.error");
class UsuarioEmailDuplicadoError extends domain_error_1.DomainError {
    code = 'USUARIO_EMAIL_DUPLICADO';
    httpStatus = 409;
    constructor(email) {
        super(`Ya existe un usuario con el email ${email}.`);
    }
}
exports.UsuarioEmailDuplicadoError = UsuarioEmailDuplicadoError;
//# sourceMappingURL=usuario-email-duplicado.error.js.map