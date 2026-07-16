"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpleadoNoEncontradoError = void 0;
const domain_error_1 = require("./domain.error");
class EmpleadoNoEncontradoError extends domain_error_1.DomainError {
    code = 'EMPLEADO_NO_ENCONTRADO';
    constructor(id) {
        super(`No se encontró el empleado ${id}.`);
    }
}
exports.EmpleadoNoEncontradoError = EmpleadoNoEncontradoError;
//# sourceMappingURL=empleado-no-encontrado.error.js.map