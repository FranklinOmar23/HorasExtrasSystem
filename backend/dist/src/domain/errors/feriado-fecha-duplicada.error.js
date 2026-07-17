"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeriadoFechaDuplicadaError = void 0;
const domain_error_1 = require("./domain.error");
class FeriadoFechaDuplicadaError extends domain_error_1.DomainError {
    code = 'FERIADO_FECHA_DUPLICADA';
    httpStatus = 409;
    constructor(fecha) {
        super(`Ya existe un feriado registrado en la fecha ${fecha}.`);
    }
}
exports.FeriadoFechaDuplicadaError = FeriadoFechaDuplicadaError;
//# sourceMappingURL=feriado-fecha-duplicada.error.js.map