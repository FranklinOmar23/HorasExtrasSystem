"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EliminarRegistroUseCase = void 0;
const periodo_cerrado_error_1 = require("../../../domain/errors/periodo-cerrado.error");
const registro_horas_no_encontrado_error_1 = require("../../../domain/errors/registro-horas-no-encontrado.error");
class EliminarRegistroUseCase {
    periodoRepository;
    registroHorasRepository;
    constructor(periodoRepository, registroHorasRepository) {
        this.periodoRepository = periodoRepository;
        this.registroHorasRepository = registroHorasRepository;
    }
    async ejecutar(id) {
        const existente = await this.registroHorasRepository.buscarPorId(id);
        if (!existente) {
            throw new registro_horas_no_encontrado_error_1.RegistroHorasNoEncontradoError(id);
        }
        const periodo = await this.periodoRepository.buscarPorId(existente.registro.periodoId);
        if (periodo?.estaCerrado()) {
            throw new periodo_cerrado_error_1.PeriodoCerradoError(existente.registro.periodoId);
        }
        await this.registroHorasRepository.eliminar(id);
    }
}
exports.EliminarRegistroUseCase = EliminarRegistroUseCase;
//# sourceMappingURL=eliminar-registro.use-case.js.map