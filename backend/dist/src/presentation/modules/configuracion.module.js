"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguracionModule = void 0;
const common_1 = require("@nestjs/common");
const configuracion_repository_port_1 = require("../../application/ports/configuracion.repository.port");
const feriado_repository_port_1 = require("../../application/ports/feriado.repository.port");
const tipo_hora_extra_repository_port_1 = require("../../application/ports/tipo-hora-extra.repository.port");
const actualizar_configuracion_use_case_1 = require("../../application/use-cases/configuracion/actualizar-configuracion.use-case");
const obtener_configuracion_use_case_1 = require("../../application/use-cases/configuracion/obtener-configuracion.use-case");
const crear_feriado_use_case_1 = require("../../application/use-cases/feriados/crear-feriado.use-case");
const eliminar_feriado_use_case_1 = require("../../application/use-cases/feriados/eliminar-feriado.use-case");
const listar_feriados_use_case_1 = require("../../application/use-cases/feriados/listar-feriados.use-case");
const actualizar_tipo_hora_extra_use_case_1 = require("../../application/use-cases/tipos-hora-extra/actualizar-tipo-hora-extra.use-case");
const listar_tipos_hora_extra_use_case_1 = require("../../application/use-cases/tipos-hora-extra/listar-tipos-hora-extra.use-case");
const configuracion_prisma_repository_1 = require("../../infrastructure/repositories/configuracion.prisma.repository");
const feriado_prisma_repository_1 = require("../../infrastructure/repositories/feriado.prisma.repository");
const tipo_hora_extra_prisma_repository_1 = require("../../infrastructure/repositories/tipo-hora-extra.prisma.repository");
const configuracion_controller_1 = require("../controllers/configuracion.controller");
const feriados_controller_1 = require("../controllers/feriados.controller");
const tipos_hora_extra_controller_1 = require("../controllers/tipos-hora-extra.controller");
let ConfiguracionModule = class ConfiguracionModule {
};
exports.ConfiguracionModule = ConfiguracionModule;
exports.ConfiguracionModule = ConfiguracionModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            configuracion_controller_1.ConfiguracionController,
            tipos_hora_extra_controller_1.TiposHoraExtraController,
            feriados_controller_1.FeriadosController,
        ],
        providers: [
            {
                provide: configuracion_repository_port_1.CONFIGURACION_REPOSITORY,
                useClass: configuracion_prisma_repository_1.ConfiguracionPrismaRepository,
            },
            {
                provide: tipo_hora_extra_repository_port_1.TIPO_HORA_EXTRA_REPOSITORY,
                useClass: tipo_hora_extra_prisma_repository_1.TipoHoraExtraPrismaRepository,
            },
            { provide: feriado_repository_port_1.FERIADO_REPOSITORY, useClass: feriado_prisma_repository_1.FeriadoPrismaRepository },
            {
                provide: obtener_configuracion_use_case_1.ObtenerConfiguracionUseCase,
                useFactory: (repo) => new obtener_configuracion_use_case_1.ObtenerConfiguracionUseCase(repo),
                inject: [configuracion_repository_port_1.CONFIGURACION_REPOSITORY],
            },
            {
                provide: actualizar_configuracion_use_case_1.ActualizarConfiguracionUseCase,
                useFactory: (repo) => new actualizar_configuracion_use_case_1.ActualizarConfiguracionUseCase(repo),
                inject: [configuracion_repository_port_1.CONFIGURACION_REPOSITORY],
            },
            {
                provide: listar_tipos_hora_extra_use_case_1.ListarTiposHoraExtraUseCase,
                useFactory: (repo) => new listar_tipos_hora_extra_use_case_1.ListarTiposHoraExtraUseCase(repo),
                inject: [tipo_hora_extra_repository_port_1.TIPO_HORA_EXTRA_REPOSITORY],
            },
            {
                provide: actualizar_tipo_hora_extra_use_case_1.ActualizarTipoHoraExtraUseCase,
                useFactory: (repo) => new actualizar_tipo_hora_extra_use_case_1.ActualizarTipoHoraExtraUseCase(repo),
                inject: [tipo_hora_extra_repository_port_1.TIPO_HORA_EXTRA_REPOSITORY],
            },
            {
                provide: listar_feriados_use_case_1.ListarFeriadosUseCase,
                useFactory: (repo) => new listar_feriados_use_case_1.ListarFeriadosUseCase(repo),
                inject: [feriado_repository_port_1.FERIADO_REPOSITORY],
            },
            {
                provide: crear_feriado_use_case_1.CrearFeriadoUseCase,
                useFactory: (repo) => new crear_feriado_use_case_1.CrearFeriadoUseCase(repo),
                inject: [feriado_repository_port_1.FERIADO_REPOSITORY],
            },
            {
                provide: eliminar_feriado_use_case_1.EliminarFeriadoUseCase,
                useFactory: (repo) => new eliminar_feriado_use_case_1.EliminarFeriadoUseCase(repo),
                inject: [feriado_repository_port_1.FERIADO_REPOSITORY],
            },
        ],
        exports: [
            configuracion_repository_port_1.CONFIGURACION_REPOSITORY,
            tipo_hora_extra_repository_port_1.TIPO_HORA_EXTRA_REPOSITORY,
            feriado_repository_port_1.FERIADO_REPOSITORY,
        ],
    })
], ConfiguracionModule);
//# sourceMappingURL=configuracion.module.js.map