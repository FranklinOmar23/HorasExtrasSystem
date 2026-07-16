"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarEmpleadosUseCase = void 0;
class ListarEmpleadosUseCase {
    empleadoRepository;
    constructor(empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }
    async ejecutar(filtro) {
        return this.empleadoRepository.listar(filtro);
    }
}
exports.ListarEmpleadosUseCase = ListarEmpleadosUseCase;
//# sourceMappingURL=listar-empleados.use-case.js.map