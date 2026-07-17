"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrosModule = void 0;
const common_1 = require("@nestjs/common");
const configuracion_repository_port_1 = require("../../application/ports/configuracion.repository.port");
const empleado_repository_port_1 = require("../../application/ports/empleado.repository.port");
const feriado_repository_port_1 = require("../../application/ports/feriado.repository.port");
const periodo_repository_port_1 = require("../../application/ports/periodo.repository.port");
const registro_horas_repository_port_1 = require("../../application/ports/registro-horas.repository.port");
const salario_repository_port_1 = require("../../application/ports/salario.repository.port");
const tipo_hora_extra_repository_port_1 = require("../../application/ports/tipo-hora-extra.repository.port");
const actualizar_registro_use_case_1 = require("../../application/use-cases/registros/actualizar-registro.use-case");
const crear_registro_use_case_1 = require("../../application/use-cases/registros/crear-registro.use-case");
const eliminar_registro_use_case_1 = require("../../application/use-cases/registros/eliminar-registro.use-case");
const listar_registros_use_case_1 = require("../../application/use-cases/registros/listar-registros.use-case");
const preview_calculo_use_case_1 = require("../../application/use-cases/registros/preview-calculo.use-case");
const calcular_desglose_service_1 = require("../../application/services/calcular-desglose.service");
const registro_horas_prisma_repository_1 = require("../../infrastructure/repositories/registro-horas.prisma.repository");
const registros_controller_1 = require("../controllers/registros.controller");
const configuracion_module_1 = require("./configuracion.module");
const empleados_module_1 = require("./empleados.module");
const periodos_module_1 = require("./periodos.module");
let RegistrosModule = class RegistrosModule {
};
exports.RegistrosModule = RegistrosModule;
exports.RegistrosModule = RegistrosModule = __decorate([
    (0, common_1.Module)({
        imports: [empleados_module_1.EmpleadosModule, periodos_module_1.PeriodosModule, configuracion_module_1.ConfiguracionModule],
        controllers: [registros_controller_1.RegistrosController],
        providers: [
            { provide: registro_horas_repository_port_1.REGISTRO_HORAS_REPOSITORY, useClass: registro_horas_prisma_repository_1.RegistroHorasPrismaRepository },
            {
                provide: calcular_desglose_service_1.CalcularDesgloseService,
                useFactory: (salarioRepo, feriadoRepo, configuracionRepo, tipoHoraExtraRepo) => new calcular_desglose_service_1.CalcularDesgloseService(salarioRepo, feriadoRepo, configuracionRepo, tipoHoraExtraRepo),
                inject: [
                    salario_repository_port_1.SALARIO_REPOSITORY,
                    feriado_repository_port_1.FERIADO_REPOSITORY,
                    configuracion_repository_port_1.CONFIGURACION_REPOSITORY,
                    tipo_hora_extra_repository_port_1.TIPO_HORA_EXTRA_REPOSITORY,
                ],
            },
            {
                provide: listar_registros_use_case_1.ListarRegistrosUseCase,
                useFactory: (periodoRepo, registroRepo) => new listar_registros_use_case_1.ListarRegistrosUseCase(periodoRepo, registroRepo),
                inject: [periodo_repository_port_1.PERIODO_REPOSITORY, registro_horas_repository_port_1.REGISTRO_HORAS_REPOSITORY],
            },
            {
                provide: crear_registro_use_case_1.CrearRegistroUseCase,
                useFactory: (periodoRepo, empleadoRepo, registroRepo, calcularDesglose) => new crear_registro_use_case_1.CrearRegistroUseCase(periodoRepo, empleadoRepo, registroRepo, calcularDesglose),
                inject: [
                    periodo_repository_port_1.PERIODO_REPOSITORY,
                    empleado_repository_port_1.EMPLEADO_REPOSITORY,
                    registro_horas_repository_port_1.REGISTRO_HORAS_REPOSITORY,
                    calcular_desglose_service_1.CalcularDesgloseService,
                ],
            },
            {
                provide: actualizar_registro_use_case_1.ActualizarRegistroUseCase,
                useFactory: (periodoRepo, registroRepo, calcularDesglose) => new actualizar_registro_use_case_1.ActualizarRegistroUseCase(periodoRepo, registroRepo, calcularDesglose),
                inject: [
                    periodo_repository_port_1.PERIODO_REPOSITORY,
                    registro_horas_repository_port_1.REGISTRO_HORAS_REPOSITORY,
                    calcular_desglose_service_1.CalcularDesgloseService,
                ],
            },
            {
                provide: eliminar_registro_use_case_1.EliminarRegistroUseCase,
                useFactory: (periodoRepo, registroRepo) => new eliminar_registro_use_case_1.EliminarRegistroUseCase(periodoRepo, registroRepo),
                inject: [periodo_repository_port_1.PERIODO_REPOSITORY, registro_horas_repository_port_1.REGISTRO_HORAS_REPOSITORY],
            },
            {
                provide: preview_calculo_use_case_1.PreviewCalculoUseCase,
                useFactory: (empleadoRepo, calcularDesglose) => new preview_calculo_use_case_1.PreviewCalculoUseCase(empleadoRepo, calcularDesglose),
                inject: [empleado_repository_port_1.EMPLEADO_REPOSITORY, calcular_desglose_service_1.CalcularDesgloseService],
            },
        ],
    })
], RegistrosModule);
//# sourceMappingURL=registros.module.js.map