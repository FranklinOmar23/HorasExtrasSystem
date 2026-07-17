"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearFeriadoUseCase = void 0;
const feriado_fecha_duplicada_error_1 = require("../../../domain/errors/feriado-fecha-duplicada.error");
class CrearFeriadoUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async ejecutar(datos) {
        const existente = await this.repository.buscarPorFecha(datos.fecha);
        if (existente) {
            throw new feriado_fecha_duplicada_error_1.FeriadoFechaDuplicadaError(datos.fecha.toISOString().slice(0, 10));
        }
        return this.repository.crear(datos);
    }
}
exports.CrearFeriadoUseCase = CrearFeriadoUseCase;
//# sourceMappingURL=crear-feriado.use-case.js.map