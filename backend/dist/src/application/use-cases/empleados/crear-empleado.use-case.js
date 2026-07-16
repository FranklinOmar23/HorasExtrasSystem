"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearEmpleadoUseCase = exports.EmpleadoCodigoDuplicadoError = void 0;
const domain_error_1 = require("../../../domain/errors/domain.error");
class EmpleadoCodigoDuplicadoError extends domain_error_1.DomainError {
    code = 'EMPLEADO_CODIGO_DUPLICADO';
    constructor(codigo) {
        super(`Ya existe un empleado con el código ${codigo}.`);
    }
}
exports.EmpleadoCodigoDuplicadoError = EmpleadoCodigoDuplicadoError;
class CrearEmpleadoUseCase {
    empleadoRepository;
    constructor(empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }
    async ejecutar(datos) {
        const existente = await this.empleadoRepository.buscarPorCodigo(datos.codigo);
        if (existente) {
            throw new EmpleadoCodigoDuplicadoError(datos.codigo);
        }
        return this.empleadoRepository.crear(datos);
    }
}
exports.CrearEmpleadoUseCase = CrearEmpleadoUseCase;
//# sourceMappingURL=crear-empleado.use-case.js.map