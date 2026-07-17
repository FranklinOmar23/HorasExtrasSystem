"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const obtener_reporte_empleado_use_case_1 = require("../../application/use-cases/reportes/obtener-reporte-empleado.use-case");
const obtener_reporte_historico_use_case_1 = require("../../application/use-cases/reportes/obtener-reporte-historico.use-case");
const obtener_reporte_periodo_use_case_1 = require("../../application/use-cases/reportes/obtener-reporte-periodo.use-case");
const reporte_excel_builder_1 = require("../../infrastructure/excel/reporte-excel.builder");
const historico_periodo_dto_1 = require("../dtos/reportes/historico-periodo.dto");
const historico_query_dto_1 = require("../dtos/reportes/historico-query.dto");
const reporte_empleado_respuesta_dto_1 = require("../dtos/reportes/reporte-empleado-respuesta.dto");
const reporte_periodo_respuesta_dto_1 = require("../dtos/reportes/reporte-periodo-respuesta.dto");
const reporte_mapper_1 = require("../mappers/reporte.mapper");
const MESES_HISTORICO_DEFAULT = 6;
let ReportesController = class ReportesController {
    obtenerReportePeriodo;
    obtenerReporteEmpleado;
    obtenerReporteHistorico;
    constructor(obtenerReportePeriodo, obtenerReporteEmpleado, obtenerReporteHistorico) {
        this.obtenerReportePeriodo = obtenerReportePeriodo;
        this.obtenerReporteEmpleado = obtenerReporteEmpleado;
        this.obtenerReporteHistorico = obtenerReporteHistorico;
    }
    async reportePeriodo(periodoId) {
        const reporte = await this.obtenerReportePeriodo.ejecutar(periodoId);
        return (0, reporte_mapper_1.aReportePeriodoRespuestaDto)(reporte);
    }
    async reporteEmpleado(periodoId, empleadoId) {
        const reporte = await this.obtenerReporteEmpleado.ejecutar(periodoId, empleadoId);
        return (0, reporte_mapper_1.aReporteEmpleadoRespuestaDto)(reporte);
    }
    async reportePeriodoExcel(periodoId) {
        const reporte = await this.obtenerReportePeriodo.ejecutar(periodoId);
        const buffer = (0, reporte_excel_builder_1.construirReporteExcel)(reporte);
        return new common_1.StreamableFile(buffer, {
            disposition: `attachment; filename="reporte-${periodoId}.xlsx"`,
        });
    }
    async historico(query) {
        const historico = await this.obtenerReporteHistorico.ejecutar(query.meses ?? MESES_HISTORICO_DEFAULT);
        return historico.map(reporte_mapper_1.aHistoricoPeriodoDto);
    }
};
exports.ReportesController = ReportesController;
__decorate([
    (0, common_1.Get)('periodos/:periodoId/reporte'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reporte de horas extra de un periodo, por empleado',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: reporte_periodo_respuesta_dto_1.ReportePeriodoRespuestaDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Periodo no encontrado' }),
    __param(0, (0, common_1.Param)('periodoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reportePeriodo", null);
__decorate([
    (0, common_1.Get)('periodos/:periodoId/reporte/empleados/:empleadoId'),
    (0, swagger_1.ApiOperation)({ summary: 'Detalle día por día de un empleado en un periodo' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: reporte_empleado_respuesta_dto_1.ReporteEmpleadoRespuestaDto }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Periodo o empleado no encontrado',
    }),
    __param(0, (0, common_1.Param)('periodoId')),
    __param(1, (0, common_1.Param)('empleadoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteEmpleado", null);
__decorate([
    (0, common_1.Get)('periodos/:periodoId/reporte/excel'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, swagger_1.ApiOperation)({ summary: 'Descarga el reporte del periodo como .xlsx' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Archivo .xlsx' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Periodo no encontrado' }),
    __param(0, (0, common_1.Param)('periodoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reportePeriodoExcel", null);
__decorate([
    (0, common_1.Get)('reportes/historico'),
    (0, swagger_1.ApiOperation)({
        summary: 'Gran total pagado por periodo en los últimos N meses',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [historico_periodo_dto_1.HistoricoPeriodoDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [historico_query_dto_1.HistoricoQueryDto]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "historico", null);
exports.ReportesController = ReportesController = __decorate([
    (0, swagger_1.ApiTags)('reportes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(obtener_reporte_periodo_use_case_1.ObtenerReportePeriodoUseCase)),
    __param(1, (0, common_1.Inject)(obtener_reporte_empleado_use_case_1.ObtenerReporteEmpleadoUseCase)),
    __param(2, (0, common_1.Inject)(obtener_reporte_historico_use_case_1.ObtenerReporteHistoricoUseCase)),
    __metadata("design:paramtypes", [obtener_reporte_periodo_use_case_1.ObtenerReportePeriodoUseCase,
        obtener_reporte_empleado_use_case_1.ObtenerReporteEmpleadoUseCase,
        obtener_reporte_historico_use_case_1.ObtenerReporteHistoricoUseCase])
], ReportesController);
//# sourceMappingURL=reportes.controller.js.map