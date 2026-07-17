"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenerReporteEmpleadoUseCase = void 0;
const empleado_no_encontrado_error_1 = require("../../../domain/errors/empleado-no-encontrado.error");
const periodo_no_encontrado_error_1 = require("../../../domain/errors/periodo-no-encontrado.error");
class ObtenerReporteEmpleadoUseCase {
    periodoRepository;
    empleadoRepository;
    reportePeriodoService;
    constructor(periodoRepository, empleadoRepository, reportePeriodoService) {
        this.periodoRepository = periodoRepository;
        this.empleadoRepository = empleadoRepository;
        this.reportePeriodoService = reportePeriodoService;
    }
    async ejecutar(periodoId, empleadoId) {
        const periodo = await this.periodoRepository.buscarPorId(periodoId);
        if (!periodo) {
            throw new periodo_no_encontrado_error_1.PeriodoNoEncontradoError(periodoId);
        }
        const empleado = await this.empleadoRepository.buscarPorId(empleadoId);
        if (!empleado) {
            throw new empleado_no_encontrado_error_1.EmpleadoNoEncontradoError(empleadoId);
        }
        const { fila, registros } = await this.reportePeriodoService.generarFilaEmpleado(periodo, empleado);
        return { periodo, fila, registros };
    }
}
exports.ObtenerReporteEmpleadoUseCase = ObtenerReporteEmpleadoUseCase;
//# sourceMappingURL=obtener-reporte-empleado.use-case.js.map