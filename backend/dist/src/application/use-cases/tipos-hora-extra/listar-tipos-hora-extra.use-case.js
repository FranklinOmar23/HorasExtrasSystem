"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarTiposHoraExtraUseCase = void 0;
class ListarTiposHoraExtraUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async ejecutar() {
        return this.repository.listar();
    }
}
exports.ListarTiposHoraExtraUseCase = ListarTiposHoraExtraUseCase;
//# sourceMappingURL=listar-tipos-hora-extra.use-case.js.map