"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenerReportePeriodoUseCase = void 0;
const periodo_no_encontrado_error_1 = require("../../../domain/errors/periodo-no-encontrado.error");
class ObtenerReportePeriodoUseCase {
    periodoRepository;
    reportePeriodoService;
    constructor(periodoRepository, reportePeriodoService) {
        this.periodoRepository = periodoRepository;
        this.reportePeriodoService = reportePeriodoService;
    }
    async ejecutar(periodoId) {
        const periodo = await this.periodoRepository.buscarPorId(periodoId);
        if (!periodo) {
            throw new periodo_no_encontrado_error_1.PeriodoNoEncontradoError(periodoId);
        }
        return this.reportePeriodoService.generar(periodo);
    }
}
exports.ObtenerReportePeriodoUseCase = ObtenerReportePeriodoUseCase;
//# sourceMappingURL=obtener-reporte-periodo.use-case.js.map