"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarRegistrosUseCase = void 0;
const periodo_no_encontrado_error_1 = require("../../../domain/errors/periodo-no-encontrado.error");
class ListarRegistrosUseCase {
    periodoRepository;
    registroHorasRepository;
    constructor(periodoRepository, registroHorasRepository) {
        this.periodoRepository = periodoRepository;
        this.registroHorasRepository = registroHorasRepository;
    }
    async ejecutar(periodoId, empleadoId) {
        const periodo = await this.periodoRepository.buscarPorId(periodoId);
        if (!periodo) {
            throw new periodo_no_encontrado_error_1.PeriodoNoEncontradoError(periodoId);
        }
        return this.registroHorasRepository.listarPorPeriodo(periodoId, empleadoId);
    }
}
exports.ListarRegistrosUseCase = ListarRegistrosUseCase;
//# sourceMappingURL=listar-registros.use-case.js.map