"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearEmpleadoUseCase = void 0;
const empleado_cedula_duplicada_error_1 = require("../../../domain/errors/empleado-cedula-duplicada.error");
const empleado_codigo_duplicado_error_1 = require("../../../domain/errors/empleado-codigo-duplicado.error");
class CrearEmpleadoUseCase {
    empleadoRepository;
    constructor(empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }
    async ejecutar(datos) {
        const codigoExistente = await this.empleadoRepository.buscarPorCodigo(datos.codigo);
        if (codigoExistente) {
            throw new empleado_codigo_duplicado_error_1.EmpleadoCodigoDuplicadoError(datos.codigo);
        }
        if (datos.cedula) {
            const cedulaExistente = await this.empleadoRepository.buscarPorCedula(datos.cedula);
            if (cedulaExistente) {
                throw new empleado_cedula_duplicada_error_1.EmpleadoCedulaDuplicadaError(datos.cedula);
            }
        }
        return this.empleadoRepository.crear(datos);
    }
}
exports.CrearEmpleadoUseCase = CrearEmpleadoUseCase;
//# sourceMappingURL=crear-empleado.use-case.js.map