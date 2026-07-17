"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearPeriodoUseCase = void 0;
const periodo_fechas_duplicadas_error_1 = require("../../../domain/errors/periodo-fechas-duplicadas.error");
const periodo_rango_fechas_invalido_error_1 = require("../../../domain/errors/periodo-rango-fechas-invalido.error");
function aFechaISO(fecha) {
    return fecha.toISOString().slice(0, 10);
}
class CrearPeriodoUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async ejecutar(datos) {
        if (datos.fechaFin < datos.fechaInicio) {
            throw new periodo_rango_fechas_invalido_error_1.PeriodoRangoFechasInvalidoError();
        }
        const existente = await this.repository.buscarPorFechas(datos.fechaInicio, datos.fechaFin);
        if (existente) {
            throw new periodo_fechas_duplicadas_error_1.PeriodoFechasDuplicadasError(aFechaISO(datos.fechaInicio), aFechaISO(datos.fechaFin));
        }
        return this.repository.crear(datos);
    }
}
exports.CrearPeriodoUseCase = CrearPeriodoUseCase;
//# sourceMappingURL=crear-periodo.use-case.js.map