"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportacionFormatoInvalidoError = void 0;
const domain_error_1 = require("./domain.error");
class ImportacionFormatoInvalidoError extends domain_error_1.DomainError {
    code = 'IMPORTACION_FORMATO_INVALIDO';
    httpStatus = 422;
    constructor(detalle) {
        super(`El archivo de importación no tiene un formato válido: ${detalle}`);
    }
}
exports.ImportacionFormatoInvalidoError = ImportacionFormatoInvalidoError;
//# sourceMappingURL=importacion-formato-invalido.error.js.map