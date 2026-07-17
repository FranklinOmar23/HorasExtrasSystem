"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CerrarPeriodoUseCase = void 0;
const periodo_cerrado_error_1 = require("../../../domain/errors/periodo-cerrado.error");
const periodo_no_encontrado_error_1 = require("../../../domain/errors/periodo-no-encontrado.error");
class CerrarPeriodoUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async ejecutar(id, cerradoPorId) {
        const periodo = await this.repository.buscarPorId(id);
        if (!periodo) {
            throw new periodo_no_encontrado_error_1.PeriodoNoEncontradoError(id);
        }
        if (periodo.estaCerrado()) {
            throw new periodo_cerrado_error_1.PeriodoCerradoError(id);
        }
        return this.repository.cerrar(id, cerradoPorId, new Date());
    }
}
exports.CerrarPeriodoUseCase = CerrarPeriodoUseCase;
//# sourceMappingURL=cerrar-periodo.use-case.js.map