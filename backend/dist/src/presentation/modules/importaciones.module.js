"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportacionesModule = void 0;
const common_1 = require("@nestjs/common");
const empleado_repository_port_1 = require("../../application/ports/empleado.repository.port");
const excel_parser_port_1 = require("../../application/ports/excel-parser.port");
const importacion_repository_port_1 = require("../../application/ports/importacion.repository.port");
const periodo_repository_port_1 = require("../../application/ports/periodo.repository.port");
const registro_horas_repository_port_1 = require("../../application/ports/registro-horas.repository.port");
const salario_repository_port_1 = require("../../application/ports/salario.repository.port");
const calcular_desglose_service_1 = require("../../application/services/calcular-desglose.service");
const validar_filas_importacion_service_1 = require("../../application/services/validar-filas-importacion.service");
const confirmar_importacion_use_case_1 = require("../../application/use-cases/importaciones/confirmar-importacion.use-case");
const listar_importaciones_use_case_1 = require("../../application/use-cases/importaciones/listar-importaciones.use-case");
const parsear_importacion_use_case_1 = require("../../application/use-cases/importaciones/parsear-importacion.use-case");
const xlsx_parser_adapter_1 = require("../../infrastructure/excel/xlsx-parser.adapter");
const importacion_prisma_repository_1 = require("../../infrastructure/repositories/importacion.prisma.repository");
const importaciones_controller_1 = require("../controllers/importaciones.controller");
const empleados_module_1 = require("./empleados.module");
const periodos_module_1 = require("./periodos.module");
const registros_module_1 = require("./registros.module");
let ImportacionesModule = class ImportacionesModule {
};
exports.ImportacionesModule = ImportacionesModule;
exports.ImportacionesModule = ImportacionesModule = __decorate([
    (0, common_1.Module)({
        imports: [empleados_module_1.EmpleadosModule, periodos_module_1.PeriodosModule, registros_module_1.RegistrosModule],
        controllers: [importaciones_controller_1.ImportacionesController],
        providers: [
            { provide: importacion_repository_port_1.IMPORTACION_REPOSITORY, useClass: importacion_prisma_repository_1.ImportacionPrismaRepository },
            { provide: excel_parser_port_1.EXCEL_PARSER, useClass: xlsx_parser_adapter_1.XlsxParserAdapter },
            {
                provide: validar_filas_importacion_service_1.ValidarFilasImportacionService,
                useFactory: (empleadoRepo, salarioRepo, registroRepo) => new validar_filas_importacion_service_1.ValidarFilasImportacionService(empleadoRepo, salarioRepo, registroRepo),
                inject: [
                    empleado_repository_port_1.EMPLEADO_REPOSITORY,
                    salario_repository_port_1.SALARIO_REPOSITORY,
                    registro_horas_repository_port_1.REGISTRO_HORAS_REPOSITORY,
                ],
            },
            {
                provide: parsear_importacion_use_case_1.ParsearImportacionUseCase,
                useFactory: (periodoRepo, excelParser, validarFilas, importacionRepo) => new parsear_importacion_use_case_1.ParsearImportacionUseCase(periodoRepo, excelParser, validarFilas, importacionRepo),
                inject: [
                    periodo_repository_port_1.PERIODO_REPOSITORY,
                    excel_parser_port_1.EXCEL_PARSER,
                    validar_filas_importacion_service_1.ValidarFilasImportacionService,
                    importacion_repository_port_1.IMPORTACION_REPOSITORY,
                ],
            },
            {
                provide: confirmar_importacion_use_case_1.ConfirmarImportacionUseCase,
                useFactory: (importacionRepo, periodoRepo, excelParser, validarFilas, registroRepo, calcularDesglose) => new confirmar_importacion_use_case_1.ConfirmarImportacionUseCase(importacionRepo, periodoRepo, excelParser, validarFilas, registroRepo, calcularDesglose),
                inject: [
                    importacion_repository_port_1.IMPORTACION_REPOSITORY,
                    periodo_repository_port_1.PERIODO_REPOSITORY,
                    excel_parser_port_1.EXCEL_PARSER,
                    validar_filas_importacion_service_1.ValidarFilasImportacionService,
                    registro_horas_repository_port_1.REGISTRO_HORAS_REPOSITORY,
                    calcular_desglose_service_1.CalcularDesgloseService,
                ],
            },
            {
                provide: listar_importaciones_use_case_1.ListarImportacionesUseCase,
                useFactory: (periodoRepo, importacionRepo) => new listar_importaciones_use_case_1.ListarImportacionesUseCase(periodoRepo, importacionRepo),
                inject: [periodo_repository_port_1.PERIODO_REPOSITORY, importacion_repository_port_1.IMPORTACION_REPOSITORY],
            },
        ],
    })
], ImportacionesModule);
//# sourceMappingURL=importaciones.module.js.map