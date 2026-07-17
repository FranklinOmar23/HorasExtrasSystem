"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenerConfiguracionUseCase = void 0;
class ObtenerConfiguracionUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async ejecutar() {
        return this.repository.obtenerTodos();
    }
}
exports.ObtenerConfiguracionUseCase = ObtenerConfiguracionUseCase;
//# sourceMappingURL=obtener-configuracion.use-case.js.map