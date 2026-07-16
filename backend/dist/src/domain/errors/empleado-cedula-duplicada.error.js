"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpleadoCedulaDuplicadaError = void 0;
const domain_error_1 = require("./domain.error");
class EmpleadoCedulaDuplicadaError extends domain_error_1.DomainError {
    code = 'EMPLEADO_CEDULA_DUPLICADA';
    constructor(cedula) {
        super(`Ya existe un empleado con la cédula ${cedula}.`);
    }
}
exports.EmpleadoCedulaDuplicadaError = EmpleadoCedulaDuplicadaError;
//# sourceMappingURL=empleado-cedula-duplicada.error.js.map