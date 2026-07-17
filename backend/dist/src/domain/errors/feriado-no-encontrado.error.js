"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeriadoNoEncontradoError = void 0;
const domain_error_1 = require("./domain.error");
class FeriadoNoEncontradoError extends domain_error_1.DomainError {
    code = 'FERIADO_NO_ENCONTRADO';
    httpStatus = 404;
    constructor(id) {
        super(`No se encontró el feriado ${id}.`);
    }
}
exports.FeriadoNoEncontradoError = FeriadoNoEncontradoError;
//# sourceMappingURL=feriado-no-encontrado.error.js.map