"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpleadoCodigoDuplicadoError = void 0;
const domain_error_1 = require("./domain.error");
class EmpleadoCodigoDuplicadoError extends domain_error_1.DomainError {
    code = 'EMPLEADO_CODIGO_DUPLICADO';
    httpStatus = 409;
    constructor(codigo) {
        super(`Ya existe un empleado con el código ${codigo}.`);
    }
}
exports.EmpleadoCodigoDuplicadoError = EmpleadoCodigoDuplicadoError;
//# sourceMappingURL=empleado-codigo-duplicado.error.js.map