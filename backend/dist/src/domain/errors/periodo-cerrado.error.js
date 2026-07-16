"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodoCerradoError = void 0;
const domain_error_1 = require("./domain.error");
class PeriodoCerradoError extends domain_error_1.DomainError {
    code = 'PERIODO_CERRADO';
    constructor(periodoId) {
        super(`El periodo ${periodoId} está cerrado y no puede modificarse.`);
    }
}
exports.PeriodoCerradoError = PeriodoCerradoError;
//# sourceMappingURL=periodo-cerrado.error.js.map