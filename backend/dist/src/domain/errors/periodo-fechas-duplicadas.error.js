"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodoFechasDuplicadasError = void 0;
const domain_error_1 = require("./domain.error");
class PeriodoFechasDuplicadasError extends domain_error_1.DomainError {
    code = 'PERIODO_FECHAS_DUPLICADAS';
    httpStatus = 409;
    constructor(fechaInicio, fechaFin) {
        super(`Ya existe un periodo registrado del ${fechaInicio} al ${fechaFin}.`);
    }
}
exports.PeriodoFechasDuplicadasError = PeriodoFechasDuplicadasError;
//# sourceMappingURL=periodo-fechas-duplicadas.error.js.map