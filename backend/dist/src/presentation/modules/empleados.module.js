"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpleadosModule = void 0;
const common_1 = require("@nestjs/common");
const empleado_repository_port_1 = require("../../application/ports/empleado.repository.port");
const salario_repository_port_1 = require("../../application/ports/salario.repository.port");
const actualizar_empleado_use_case_1 = require("../../application/use-cases/empleados/actualizar-empleado.use-case");
const crear_empleado_use_case_1 = require("../../application/use-cases/empleados/crear-empleado.use-case");
const listar_empleados_use_case_1 = require("../../application/use-cases/empleados/listar-empleados.use-case");
const obtener_empleado_use_case_1 = require("../../application/use-cases/empleados/obtener-empleado.use-case");
const crear_salario_use_case_1 = require("../../application/use-cases/salarios/crear-salario.use-case");
const listar_salarios_use_case_1 = require("../../application/use-cases/salarios/listar-salarios.use-case");
const empleado_prisma_repository_1 = require("../../infrastructure/repositories/empleado.prisma.repository");
const salario_prisma_repository_1 = require("../../infrastructure/repositories/salario.prisma.repository");
const empleados_controller_1 = require("../controllers/empleados.controller");
let EmpleadosModule = class EmpleadosModule {
};
exports.EmpleadosModule = EmpleadosModule;
exports.EmpleadosModule = EmpleadosModule = __decorate([
    (0, common_1.Module)({
        controllers: [empleados_controller_1.EmpleadosController],
        providers: [
            { provide: empleado_repository_port_1.EMPLEADO_REPOSITORY, useClass: empleado_prisma_repository_1.EmpleadoPrismaRepository },
            { provide: salario_repository_port_1.SALARIO_REPOSITORY, useClass: salario_prisma_repository_1.SalarioPrismaRepository },
            {
                provide: listar_empleados_use_case_1.ListarEmpleadosUseCase,
                useFactory: (repo) => new listar_empleados_use_case_1.ListarEmpleadosUseCase(repo),
                inject: [empleado_repository_port_1.EMPLEADO_REPOSITORY],
            },
            {
                provide: obtener_empleado_use_case_1.ObtenerEmpleadoUseCase,
                useFactory: (repo) => new obtener_empleado_use_case_1.ObtenerEmpleadoUseCase(repo),
                inject: [empleado_repository_port_1.EMPLEADO_REPOSITORY],
            },
            {
                provide: crear_empleado_use_case_1.CrearEmpleadoUseCase,
                useFactory: (repo) => new crear_empleado_use_case_1.CrearEmpleadoUseCase(repo),
                inject: [empleado_repository_port_1.EMPLEADO_REPOSITORY],
            },
            {
                provide: actualizar_empleado_use_case_1.ActualizarEmpleadoUseCase,
                useFactory: (repo) => new actualizar_empleado_use_case_1.ActualizarEmpleadoUseCase(repo),
                inject: [empleado_repository_port_1.EMPLEADO_REPOSITORY],
            },
            {
                provide: listar_salarios_use_case_1.ListarSalariosUseCase,
                useFactory: (empleadoRepo, salarioRepo) => new listar_salarios_use_case_1.ListarSalariosUseCase(empleadoRepo, salarioRepo),
                inject: [empleado_repository_port_1.EMPLEADO_REPOSITORY, salario_repository_port_1.SALARIO_REPOSITORY],
            },
            {
                provide: crear_salario_use_case_1.CrearSalarioUseCase,
                useFactory: (empleadoRepo, salarioRepo) => new crear_salario_use_case_1.CrearSalarioUseCase(empleadoRepo, salarioRepo),
                inject: [empleado_repository_port_1.EMPLEADO_REPOSITORY, salario_repository_port_1.SALARIO_REPOSITORY],
            },
        ],
        exports: [empleado_repository_port_1.EMPLEADO_REPOSITORY, salario_repository_port_1.SALARIO_REPOSITORY],
    })
], EmpleadosModule);
//# sourceMappingURL=empleados.module.js.map