"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalarioNoVigenteError = void 0;
const domain_error_1 = require("./domain.error");
class SalarioNoVigenteError extends domain_error_1.DomainError {
    code = 'SALARIO_NO_VIGENTE';
    httpStatus = 422;
    constructor(empleadoId, fecha) {
        super(`El empleado ${empleadoId} no tiene un salario vigente en la fecha ${fecha}.`);
    }
}
exports.SalarioNoVigenteError = SalarioNoVigenteError;
//# sourceMappingURL=salario-no-vigente.error.js.map