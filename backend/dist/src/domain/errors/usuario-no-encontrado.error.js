"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioNoEncontradoError = void 0;
const domain_error_1 = require("./domain.error");
class UsuarioNoEncontradoError extends domain_error_1.DomainError {
    code = 'USUARIO_NO_ENCONTRADO';
    httpStatus = 404;
    constructor(id) {
        super(`No se encontró el usuario ${id}.`);
    }
}
exports.UsuarioNoEncontradoError = UsuarioNoEncontradoError;
//# sourceMappingURL=usuario-no-encontrado.error.js.map