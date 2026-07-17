"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenerPeriodoUseCase = void 0;
const periodo_no_encontrado_error_1 = require("../../../domain/errors/periodo-no-encontrado.error");
class ObtenerPeriodoUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async ejecutar(id) {
        const periodo = await this.repository.buscarPorId(id);
        if (!periodo) {
            throw new periodo_no_encontrado_error_1.PeriodoNoEncontradoError(id);
        }
        return periodo;
    }
}
exports.ObtenerPeriodoUseCase = ObtenerPeriodoUseCase;
//# sourceMappingURL=obtener-periodo.use-case.js.map