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
exports.RegistrosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const actualizar_registro_use_case_1 = require("../../application/use-cases/registros/actualizar-registro.use-case");
const crear_registro_use_case_1 = require("../../application/use-cases/registros/crear-registro.use-case");
const eliminar_registro_use_case_1 = require("../../application/use-cases/registros/eliminar-registro.use-case");
const listar_registros_use_case_1 = require("../../application/use-cases/registros/listar-registros.use-case");
const preview_calculo_use_case_1 = require("../../application/use-cases/registros/preview-calculo.use-case");
const actualizar_registro_dto_1 = require("../dtos/registros/actualizar-registro.dto");
const calculo_respuesta_dto_1 = require("../dtos/registros/calculo-respuesta.dto");
const crear_registro_dto_1 = require("../dtos/registros/crear-registro.dto");
const preview_calculo_dto_1 = require("../dtos/registros/preview-calculo.dto");
const registro_respuesta_dto_1 = require("../dtos/registros/registro-respuesta.dto");
const registro_horas_mapper_1 = require("../mappers/registro-horas.mapper");
let RegistrosController = class RegistrosController {
    listarRegistros;
    crearRegistro;
    actualizarRegistro;
    eliminarRegistro;
    previewCalculo;
    constructor(listarRegistros, crearRegistro, actualizarRegistro, eliminarRegistro, previewCalculo) {
        this.listarRegistros = listarRegistros;
        this.crearRegistro = crearRegistro;
        this.actualizarRegistro = actualizarRegistro;
        this.eliminarRegistro = eliminarRegistro;
        this.previewCalculo = previewCalculo;
    }
    async listar(periodoId, empleadoId) {
        const registros = await this.listarRegistros.ejecutar(periodoId, empleadoId);
        return registros.map(registro_horas_mapper_1.aRegistroRespuestaDto);
    }
    async crear(dto) {
        const registro = await this.crearRegistro.ejecutar({
            periodoId: dto.periodoId,
            empleadoId: dto.empleadoId,
            fecha: new Date(dto.fecha),
            horaEntrada: dto.horaEntrada,
            horaSalida: dto.horaSalida,
            comentario: dto.comentario ?? null,
        });
        return (0, registro_horas_mapper_1.aRegistroRespuestaDto)(registro);
    }
    async actualizar(id, dto) {
        const registro = await this.actualizarRegistro.ejecutar(id, {
            fecha: dto.fecha ? new Date(dto.fecha) : undefined,
            horaEntrada: dto.horaEntrada,
            horaSalida: dto.horaSalida,
            comentario: dto.comentario,
        });
        return (0, registro_horas_mapper_1.aRegistroRespuestaDto)(registro);
    }
    async eliminar(id) {
        await this.eliminarRegistro.ejecutar(id);
    }
    async preview(dto) {
        const filas = await this.previewCalculo.ejecutar({
            empleadoId: dto.empleadoId,
            fecha: new Date(dto.fecha),
            horaEntrada: dto.horaEntrada,
            horaSalida: dto.horaSalida,
        });
        return filas.map(registro_horas_mapper_1.aFilaCalculoRespuestaDto);
    }
};
exports.RegistrosController = RegistrosController;
__decorate([
    (0, common_1.Get)('periodos/:periodoId/registros'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista los registros de horas de un periodo' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [registro_respuesta_dto_1.RegistroRespuestaDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Periodo no encontrado' }),
    __param(0, (0, common_1.Param)('periodoId')),
    __param(1, (0, common_1.Query)('empleadoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RegistrosController.prototype, "listar", null);
__decorate([
    (0, common_1.Post)('registros'),
    (0, swagger_1.ApiOperation)({ summary: 'Crea un registro de horas y calcula su desglose' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: registro_respuesta_dto_1.RegistroRespuestaDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Periodo o empleado no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El periodo está cerrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_registro_dto_1.CrearRegistroDto]),
    __metadata("design:returntype", Promise)
], RegistrosController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)('registros/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Actualiza un registro de horas y recalcula su desglose',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: registro_respuesta_dto_1.RegistroRespuestaDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Registro no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El periodo está cerrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_registro_dto_1.ActualizarRegistroDto]),
    __metadata("design:returntype", Promise)
], RegistrosController.prototype, "actualizar", null);
__decorate([
    (0, common_1.Delete)('registros/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Elimina un registro de horas' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Eliminado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Registro no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El periodo está cerrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RegistrosController.prototype, "eliminar", null);
__decorate([
    (0, common_1.Post)('registros/preview'),
    (0, swagger_1.ApiOperation)({
        summary: 'Calcula el desglose de horas extra sin persistir nada',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [calculo_respuesta_dto_1.CalculoRespuestaDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Empleado no encontrado' }),
    (0, swagger_1.ApiResponse)({
        status: 422,
        description: 'El empleado no tiene salario vigente en esa fecha',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [preview_calculo_dto_1.PreviewCalculoDto]),
    __metadata("design:returntype", Promise)
], RegistrosController.prototype, "preview", null);
exports.RegistrosController = RegistrosController = __decorate([
    (0, swagger_1.ApiTags)('registros'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(listar_registros_use_case_1.ListarRegistrosUseCase)),
    __param(1, (0, common_1.Inject)(crear_registro_use_case_1.CrearRegistroUseCase)),
    __param(2, (0, common_1.Inject)(actualizar_registro_use_case_1.ActualizarRegistroUseCase)),
    __param(3, (0, common_1.Inject)(eliminar_registro_use_case_1.EliminarRegistroUseCase)),
    __param(4, (0, common_1.Inject)(preview_calculo_use_case_1.PreviewCalculoUseCase)),
    __metadata("design:paramtypes", [listar_registros_use_case_1.ListarRegistrosUseCase,
        crear_registro_use_case_1.CrearRegistroUseCase,
        actualizar_registro_use_case_1.ActualizarRegistroUseCase,
        eliminar_registro_use_case_1.EliminarRegistroUseCase,
        preview_calculo_use_case_1.PreviewCalculoUseCase])
], RegistrosController);
//# sourceMappingURL=registros.controller.js.map