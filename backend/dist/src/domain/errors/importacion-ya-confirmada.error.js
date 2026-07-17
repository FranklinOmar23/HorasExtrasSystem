"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportacionYaConfirmadaError = void 0;
const domain_error_1 = require("./domain.error");
class ImportacionYaConfirmadaError extends domain_error_1.DomainError {
    code = 'IMPORTACION_YA_CONFIRMADA';
    httpStatus = 409;
    constructor(id) {
        super(`La importación ${id} ya fue confirmada anteriormente.`);
    }
}
exports.ImportacionYaConfirmadaError = ImportacionYaConfirmadaError;
//# sourceMappingURL=importacion-ya-confirmada.error.js.map