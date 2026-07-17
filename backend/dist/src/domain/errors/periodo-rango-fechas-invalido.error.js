"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodoRangoFechasInvalidoError = void 0;
const domain_error_1 = require("./domain.error");
class PeriodoRangoFechasInvalidoError extends domain_error_1.DomainError {
    code = 'PERIODO_RANGO_FECHAS_INVALIDO';
    httpStatus = 400;
    constructor() {
        super('La fecha de fin debe ser posterior o igual a la fecha de inicio.');
    }
}
exports.PeriodoRangoFechasInvalidoError = PeriodoRangoFechasInvalidoError;
//# sourceMappingURL=periodo-rango-fechas-invalido.error.js.map