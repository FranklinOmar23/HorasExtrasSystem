"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodoNoEncontradoError = void 0;
const domain_error_1 = require("./domain.error");
class PeriodoNoEncontradoError extends domain_error_1.DomainError {
    code = 'PERIODO_NO_ENCONTRADO';
    httpStatus = 404;
    constructor(id) {
        super(`No se encontró el periodo ${id}.`);
    }
}
exports.PeriodoNoEncontradoError = PeriodoNoEncontradoError;
//# sourceMappingURL=periodo-no-encontrado.error.js.map