"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenerEmpleadoUseCase = void 0;
const empleado_no_encontrado_error_1 = require("../../../domain/errors/empleado-no-encontrado.error");
class ObtenerEmpleadoUseCase {
    empleadoRepository;
    constructor(empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }
    async ejecutar(id) {
        const empleado = await this.empleadoRepository.buscarPorId(id);
        if (!empleado) {
            throw new empleado_no_encontrado_error_1.EmpleadoNoEncontradoError(id);
        }
        return empleado;
    }
}
exports.ObtenerEmpleadoUseCase = ObtenerEmpleadoUseCase;
//# sourceMappingURL=obtener-empleado.use-case.js.map