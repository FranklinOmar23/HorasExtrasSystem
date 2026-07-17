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
exports.PeriodosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cerrar_periodo_use_case_1 = require("../../application/use-cases/periodos/cerrar-periodo.use-case");
const crear_periodo_use_case_1 = require("../../application/use-cases/periodos/crear-periodo.use-case");
const listar_periodos_use_case_1 = require("../../application/use-cases/periodos/listar-periodos.use-case");
const obtener_periodo_use_case_1 = require("../../application/use-cases/periodos/obtener-periodo.use-case");
const usuario_entity_1 = require("../../domain/entities/usuario.entity");
const usuario_actual_decorator_1 = require("../decorators/usuario-actual.decorator");
const crear_periodo_dto_1 = require("../dtos/periodos/crear-periodo.dto");
const periodo_respuesta_dto_1 = require("../dtos/periodos/periodo-respuesta.dto");
const periodo_mapper_1 = require("../mappers/periodo.mapper");
let PeriodosController = class PeriodosController {
    listarPeriodos;
    obtenerPeriodo;
    crearPeriodo;
    cerrarPeriodo;
    constructor(listarPeriodos, obtenerPeriodo, crearPeriodo, cerrarPeriodo) {
        this.listarPeriodos = listarPeriodos;
        this.obtenerPeriodo = obtenerPeriodo;
        this.crearPeriodo = crearPeriodo;
        this.cerrarPeriodo = cerrarPeriodo;
    }
    async listar() {
        const periodos = await this.listarPeriodos.ejecutar();
        return periodos.map(periodo_mapper_1.aPeriodoRespuestaDto);
    }
    async obtener(id) {
        const periodo = await this.obtenerPeriodo.ejecutar(id);
        return (0, periodo_mapper_1.aPeriodoRespuestaDto)(periodo);
    }
    async crear(dto) {
        const periodo = await this.crearPeriodo.ejecutar({
            fechaInicio: new Date(dto.fechaInicio),
            fechaFin: new Date(dto.fechaFin),
        });
        return (0, periodo_mapper_1.aPeriodoRespuestaDto)(periodo);
    }
    async cerrar(id, usuario) {
        const periodo = await this.cerrarPeriodo.ejecutar(id, usuario.id);
        return (0, periodo_mapper_1.aPeriodoRespuestaDto)(periodo);
    }
};
exports.PeriodosController = PeriodosController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lista los periodos de nómina' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [periodo_respuesta_dto_1.PeriodoRespuestaDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PeriodosController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene un periodo por id' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: periodo_respuesta_dto_1.PeriodoRespuestaDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Periodo no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PeriodosController.prototype, "obtener", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crea un periodo de nómina' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: periodo_respuesta_dto_1.PeriodoRespuestaDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Rango de fechas inválido' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe un periodo con esas fechas',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_periodo_dto_1.CrearPeriodoDto]),
    __metadata("design:returntype", Promise)
], PeriodosController.prototype, "crear", null);
__decorate([
    (0, common_1.Post)(':id/cerrar'),
    (0, swagger_1.ApiOperation)({ summary: 'Cierra un periodo (lo vuelve inmutable)' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: periodo_respuesta_dto_1.PeriodoRespuestaDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Periodo no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El periodo ya está cerrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, usuario_actual_decorator_1.UsuarioActual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, usuario_entity_1.Usuario]),
    __metadata("design:returntype", Promise)
], PeriodosController.prototype, "cerrar", null);
exports.PeriodosController = PeriodosController = __decorate([
    (0, swagger_1.ApiTags)('periodos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('periodos'),
    __param(0, (0, common_1.Inject)(listar_periodos_use_case_1.ListarPeriodosUseCase)),
    __param(1, (0, common_1.Inject)(obtener_periodo_use_case_1.ObtenerPeriodoUseCase)),
    __param(2, (0, common_1.Inject)(crear_periodo_use_case_1.CrearPeriodoUseCase)),
    __param(3, (0, common_1.Inject)(cerrar_periodo_use_case_1.CerrarPeriodoUseCase)),
    __metadata("design:paramtypes", [listar_periodos_use_case_1.ListarPeriodosUseCase,
        obtener_periodo_use_case_1.ObtenerPeriodoUseCase,
        crear_periodo_use_case_1.CrearPeriodoUseCase,
        cerrar_periodo_use_case_1.CerrarPeriodoUseCase])
], PeriodosController);
//# sourceMappingURL=periodos.controller.js.map