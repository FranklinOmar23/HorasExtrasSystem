"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportacionNoEncontradaError = void 0;
const domain_error_1 = require("./domain.error");
class ImportacionNoEncontradaError extends domain_error_1.DomainError {
    code = 'IMPORTACION_NO_ENCONTRADA';
    httpStatus = 404;
    constructor(id) {
        super(`No se encontró la importación ${id}.`);
    }
}
exports.ImportacionNoEncontradaError = ImportacionNoEncontradaError;
//# sourceMappingURL=importacion-no-encontrada.error.js.map