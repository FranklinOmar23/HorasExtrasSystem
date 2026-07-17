"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarImportacionesUseCase = void 0;
const periodo_no_encontrado_error_1 = require("../../../domain/errors/periodo-no-encontrado.error");
class ListarImportacionesUseCase {
    periodoRepository;
    importacionRepository;
    constructor(periodoRepository, importacionRepository) {
        this.periodoRepository = periodoRepository;
        this.importacionRepository = importacionRepository;
    }
    async ejecutar(periodoId) {
        const periodo = await this.periodoRepository.buscarPorId(periodoId);
        if (!periodo) {
            throw new periodo_no_encontrado_error_1.PeriodoNoEncontradoError(periodoId);
        }
        return this.importacionRepository.listarPorPeriodo(periodoId);
    }
}
exports.ListarImportacionesUseCase = ListarImportacionesUseCase;
//# sourceMappingURL=listar-importaciones.use-case.js.map