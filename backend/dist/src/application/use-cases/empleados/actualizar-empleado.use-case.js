"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarEmpleadoUseCase = void 0;
const empleado_cedula_duplicada_error_1 = require("../../../domain/errors/empleado-cedula-duplicada.error");
const empleado_no_encontrado_error_1 = require("../../../domain/errors/empleado-no-encontrado.error");
class ActualizarEmpleadoUseCase {
    empleadoRepository;
    constructor(empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }
    async ejecutar(id, datos) {
        const empleado = await this.empleadoRepository.buscarPorId(id);
        if (!empleado) {
            throw new empleado_no_encontrado_error_1.EmpleadoNoEncontradoError(id);
        }
        if (datos.cedula && datos.cedula !== empleado.cedula) {
            const cedulaExistente = await this.empleadoRepository.buscarPorCedula(datos.cedula);
            if (cedulaExistente) {
                throw new empleado_cedula_duplicada_error_1.EmpleadoCedulaDuplicadaError(datos.cedula);
            }
        }
        return this.empleadoRepository.actualizar(id, datos);
    }
}
exports.ActualizarEmpleadoUseCase = ActualizarEmpleadoUseCase;
//# sourceMappingURL=actualizar-empleado.use-case.js.map