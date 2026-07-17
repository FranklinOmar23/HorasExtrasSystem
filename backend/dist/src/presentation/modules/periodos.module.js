"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodosModule = void 0;
const common_1 = require("@nestjs/common");
const periodo_repository_port_1 = require("../../application/ports/periodo.repository.port");
const cerrar_periodo_use_case_1 = require("../../application/use-cases/periodos/cerrar-periodo.use-case");
const crear_periodo_use_case_1 = require("../../application/use-cases/periodos/crear-periodo.use-case");
const listar_periodos_use_case_1 = require("../../application/use-cases/periodos/listar-periodos.use-case");
const obtener_periodo_use_case_1 = require("../../application/use-cases/periodos/obtener-periodo.use-case");
const periodo_prisma_repository_1 = require("../../infrastructure/repositories/periodo.prisma.repository");
const periodos_controller_1 = require("../controllers/periodos.controller");
let PeriodosModule = class PeriodosModule {
};
exports.PeriodosModule = PeriodosModule;
exports.PeriodosModule = PeriodosModule = __decorate([
    (0, common_1.Module)({
        controllers: [periodos_controller_1.PeriodosController],
        providers: [
            { provide: periodo_repository_port_1.PERIODO_REPOSITORY, useClass: periodo_prisma_repository_1.PeriodoPrismaRepository },
            {
                provide: listar_periodos_use_case_1.ListarPeriodosUseCase,
                useFactory: (repo) => new listar_periodos_use_case_1.ListarPeriodosUseCase(repo),
                inject: [periodo_repository_port_1.PERIODO_REPOSITORY],
            },
            {
                provide: obtener_periodo_use_case_1.ObtenerPeriodoUseCase,
                useFactory: (repo) => new obtener_periodo_use_case_1.ObtenerPeriodoUseCase(repo),
                inject: [periodo_repository_port_1.PERIODO_REPOSITORY],
            },
            {
                provide: crear_periodo_use_case_1.CrearPeriodoUseCase,
                useFactory: (repo) => new crear_periodo_use_case_1.CrearPeriodoUseCase(repo),
                inject: [periodo_repository_port_1.PERIODO_REPOSITORY],
            },
            {
                provide: cerrar_periodo_use_case_1.CerrarPeriodoUseCase,
                useFactory: (repo) => new cerrar_periodo_use_case_1.CerrarPeriodoUseCase(repo),
                inject: [periodo_repository_port_1.PERIODO_REPOSITORY],
            },
        ],
        exports: [periodo_repository_port_1.PERIODO_REPOSITORY],
    })
], PeriodosModule);
//# sourceMappingURL=periodos.module.js.map