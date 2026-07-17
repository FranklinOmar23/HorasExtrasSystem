"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarPeriodosUseCase = void 0;
class ListarPeriodosUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async ejecutar() {
        return this.repository.listar();
    }
}
exports.ListarPeriodosUseCase = ListarPeriodosUseCase;
//# sourceMappingURL=listar-periodos.use-case.js.map