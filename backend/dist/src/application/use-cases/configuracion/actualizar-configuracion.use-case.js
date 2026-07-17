"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarConfiguracionUseCase = void 0;
class ActualizarConfiguracionUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async ejecutar(cambios) {
        return this.repository.actualizar(cambios);
    }
}
exports.ActualizarConfiguracionUseCase = ActualizarConfiguracionUseCase;
//# sourceMappingURL=actualizar-configuracion.use-case.js.map