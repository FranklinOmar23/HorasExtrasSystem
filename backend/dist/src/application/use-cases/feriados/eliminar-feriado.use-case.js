"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EliminarFeriadoUseCase = void 0;
const feriado_no_encontrado_error_1 = require("../../../domain/errors/feriado-no-encontrado.error");
class EliminarFeriadoUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async ejecutar(id) {
        const existente = await this.repository.buscarPorId(id);
        if (!existente) {
            throw new feriado_no_encontrado_error_1.FeriadoNoEncontradoError(id);
        }
        await this.repository.eliminar(id);
    }
}
exports.EliminarFeriadoUseCase = EliminarFeriadoUseCase;
//# sourceMappingURL=eliminar-feriado.use-case.js.map