"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarFeriadosUseCase = void 0;
class ListarFeriadosUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async ejecutar(anio) {
        return this.repository.listar(anio);
    }
}
exports.ListarFeriadosUseCase = ListarFeriadosUseCase;
//# sourceMappingURL=listar-feriados.use-case.js.map