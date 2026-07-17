"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistroHorasNoEncontradoError = void 0;
const domain_error_1 = require("./domain.error");
class RegistroHorasNoEncontradoError extends domain_error_1.DomainError {
    code = 'REGISTRO_HORAS_NO_ENCONTRADO';
    httpStatus = 404;
    constructor(id) {
        super(`No se encontró el registro de horas ${id}.`);
    }
}
exports.RegistroHorasNoEncontradoError = RegistroHorasNoEncontradoError;
//# sourceMappingURL=registro-horas-no-encontrado.error.js.map