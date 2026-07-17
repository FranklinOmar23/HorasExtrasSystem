"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarTipoHoraExtraUseCase = void 0;
const tipo_hora_extra_no_encontrado_error_1 = require("../../../domain/errors/tipo-hora-extra-no-encontrado.error");
class ActualizarTipoHoraExtraUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async ejecutar(id, datos) {
        const existente = await this.repository.buscarPorId(id);
        if (!existente) {
            throw new tipo_hora_extra_no_encontrado_error_1.TipoHoraExtraNoEncontradoError(id);
        }
        return this.repository.actualizar(id, datos);
    }
}
exports.ActualizarTipoHoraExtraUseCase = ActualizarTipoHoraExtraUseCase;
//# sourceMappingURL=actualizar-tipo-hora-extra.use-case.js.map