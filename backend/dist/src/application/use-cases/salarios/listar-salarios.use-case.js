"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarSalariosUseCase = void 0;
const empleado_no_encontrado_error_1 = require("../../../domain/errors/empleado-no-encontrado.error");
class ListarSalariosUseCase {
    empleadoRepository;
    salarioRepository;
    constructor(empleadoRepository, salarioRepository) {
        this.empleadoRepository = empleadoRepository;
        this.salarioRepository = salarioRepository;
    }
    async ejecutar(empleadoId) {
        const empleado = await this.empleadoRepository.buscarPorId(empleadoId);
        if (!empleado) {
            throw new empleado_no_encontrado_error_1.EmpleadoNoEncontradoError(empleadoId);
        }
        return this.salarioRepository.listarPorEmpleado(empleadoId);
    }
}
exports.ListarSalariosUseCase = ListarSalariosUseCase;
//# sourceMappingURL=listar-salarios.use-case.js.map