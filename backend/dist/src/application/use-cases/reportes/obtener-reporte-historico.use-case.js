"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenerReporteHistoricoUseCase = void 0;
function fechaCorteHaceMeses(meses) {
    const ahora = new Date();
    return new Date(Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth() - meses, ahora.getUTCDate()));
}
class ObtenerReporteHistoricoUseCase {
    periodoRepository;
    reportePeriodoService;
    constructor(periodoRepository, reportePeriodoService) {
        this.periodoRepository = periodoRepository;
        this.reportePeriodoService = reportePeriodoService;
    }
    async ejecutar(meses) {
        const todos = await this.periodoRepository.listar();
        const fechaCorte = fechaCorteHaceMeses(meses);
        const periodosEnRango = todos
            .filter((periodo) => periodo.fechaInicio >= fechaCorte)
            .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());
        const resultado = [];
        for (const periodo of periodosEnRango) {
            const reporte = await this.reportePeriodoService.generar(periodo);
            resultado.push({ periodo, granTotal: reporte.granTotal });
        }
        return resultado;
    }
}
exports.ObtenerReporteHistoricoUseCase = ObtenerReporteHistoricoUseCase;
//# sourceMappingURL=obtener-reporte-historico.use-case.js.map