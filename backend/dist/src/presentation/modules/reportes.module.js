"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesModule = void 0;
const common_1 = require("@nestjs/common");
const configuracion_repository_port_1 = require("../../application/ports/configuracion.repository.port");
const empleado_repository_port_1 = require("../../application/ports/empleado.repository.port");
const periodo_repository_port_1 = require("../../application/ports/periodo.repository.port");
const registro_horas_repository_port_1 = require("../../application/ports/registro-horas.repository.port");
const salario_repository_port_1 = require("../../application/ports/salario.repository.port");
const reporte_periodo_service_1 = require("../../application/services/reporte-periodo.service");
const obtener_reporte_empleado_use_case_1 = require("../../application/use-cases/reportes/obtener-reporte-empleado.use-case");
const obtener_reporte_historico_use_case_1 = require("../../application/use-cases/reportes/obtener-reporte-historico.use-case");
const obtener_reporte_periodo_use_case_1 = require("../../application/use-cases/reportes/obtener-reporte-periodo.use-case");
const reportes_controller_1 = require("../controllers/reportes.controller");
const configuracion_module_1 = require("./configuracion.module");
const empleados_module_1 = require("./empleados.module");
const periodos_module_1 = require("./periodos.module");
const registros_module_1 = require("./registros.module");
let ReportesModule = class ReportesModule {
};
exports.ReportesModule = ReportesModule;
exports.ReportesModule = ReportesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            empleados_module_1.EmpleadosModule,
            periodos_module_1.PeriodosModule,
            configuracion_module_1.ConfiguracionModule,
            registros_module_1.RegistrosModule,
        ],
        controllers: [reportes_controller_1.ReportesController],
        providers: [
            {
                provide: reporte_periodo_service_1.ReportePeriodoService,
                useFactory: (registroRepo, empleadoRepo, salarioRepo, configuracionRepo) => new reporte_periodo_service_1.ReportePeriodoService(registroRepo, empleadoRepo, salarioRepo, configuracionRepo),
                inject: [
                    registro_horas_repository_port_1.REGISTRO_HORAS_REPOSITORY,
                    empleado_repository_port_1.EMPLEADO_REPOSITORY,
                    salario_repository_port_1.SALARIO_REPOSITORY,
                    configuracion_repository_port_1.CONFIGURACION_REPOSITORY,
                ],
            },
            {
                provide: obtener_reporte_periodo_use_case_1.ObtenerReportePeriodoUseCase,
                useFactory: (periodoRepo, reporteService) => new obtener_reporte_periodo_use_case_1.ObtenerReportePeriodoUseCase(periodoRepo, reporteService),
                inject: [periodo_repository_port_1.PERIODO_REPOSITORY, reporte_periodo_service_1.ReportePeriodoService],
            },
            {
                provide: obtener_reporte_empleado_use_case_1.ObtenerReporteEmpleadoUseCase,
                useFactory: (periodoRepo, empleadoRepo, reporteService) => new obtener_reporte_empleado_use_case_1.ObtenerReporteEmpleadoUseCase(periodoRepo, empleadoRepo, reporteService),
                inject: [periodo_repository_port_1.PERIODO_REPOSITORY, empleado_repository_port_1.EMPLEADO_REPOSITORY, reporte_periodo_service_1.ReportePeriodoService],
            },
            {
                provide: obtener_reporte_historico_use_case_1.ObtenerReporteHistoricoUseCase,
                useFactory: (periodoRepo, reporteService) => new obtener_reporte_historico_use_case_1.ObtenerReporteHistoricoUseCase(periodoRepo, reporteService),
                inject: [periodo_repository_port_1.PERIODO_REPOSITORY, reporte_periodo_service_1.ReportePeriodoService],
            },
        ],
    })
], ReportesModule);
//# sourceMappingURL=reportes.module.js.map