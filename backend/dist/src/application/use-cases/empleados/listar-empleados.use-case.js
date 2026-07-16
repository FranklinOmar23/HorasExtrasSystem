"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarEmpleadosUseCase = void 0;
class ListarEmpleadosUseCase {
    empleadoRepository;
    constructor(empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }
    async ejecutar() {
        return this.empleadoRepository.listar();
    }
}
exports.ListarEmpleadosUseCase = ListarEmpleadosUseCase;
//# sourceMappingURL=listar-empleados.use-case.js.map