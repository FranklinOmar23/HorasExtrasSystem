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
exports.ImportacionesController = void 0;
const platform_express_1 = require("@nestjs/platform-express");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const confirmar_importacion_use_case_1 = require("../../application/use-cases/importaciones/confirmar-importacion.use-case");
const listar_importaciones_use_case_1 = require("../../application/use-cases/importaciones/listar-importaciones.use-case");
const parsear_importacion_use_case_1 = require("../../application/use-cases/importaciones/parsear-importacion.use-case");
const usuario_entity_1 = require("../../domain/entities/usuario.entity");
const importacion_formato_invalido_error_1 = require("../../domain/errors/importacion-formato-invalido.error");
const usuario_actual_decorator_1 = require("../decorators/usuario-actual.decorator");
const confirmar_importacion_dto_1 = require("../dtos/importaciones/confirmar-importacion.dto");
const importacion_respuesta_dto_1 = require("../dtos/importaciones/importacion-respuesta.dto");
const parsear_importacion_respuesta_dto_1 = require("../dtos/importaciones/parsear-importacion-respuesta.dto");
const importacion_mapper_1 = require("../mappers/importacion.mapper");
const LIMITE_TAMANO_ARCHIVO_BYTES = 10 * 1024 * 1024;
let ImportacionesController = class ImportacionesController {
    parsearImportacion;
    confirmarImportacion;
    listarImportaciones;
    constructor(parsearImportacion, confirmarImportacion, listarImportaciones) {
        this.parsearImportacion = parsearImportacion;
        this.confirmarImportacion = confirmarImportacion;
        this.listarImportaciones = listarImportaciones;
    }
    async parsear(periodoId, archivo, usuario) {
        if (!archivo) {
            throw new importacion_formato_invalido_error_1.ImportacionFormatoInvalidoError('no se recibió ningún archivo (campo "archivo").');
        }
        const { importacion, filas } = await this.parsearImportacion.ejecutar({
            periodoId,
            usuarioId: usuario.id,
            nombreArchivo: archivo.originalname,
            contenido: archivo.buffer,
        });
        return {
            importacionId: importacion.id,
            filas: filas.map(importacion_mapper_1.aFilaImportacionRespuestaDto),
            resumen: {
                ok: importacion.filasOk,
                advertencias: importacion.filasAdvertencia,
                errores: importacion.filasError,
            },
        };
    }
    async confirmar(id, dto) {
        const importacion = await this.confirmarImportacion.ejecutar({
            importacionId: id,
            incluirAdvertencias: dto.incluirAdvertencias,
        });
        return (0, importacion_mapper_1.aImportacionRespuestaDto)(importacion);
    }
    async listar(periodoId) {
        const importaciones = await this.listarImportaciones.ejecutar(periodoId);
        return importaciones.map(importacion_mapper_1.aImportacionRespuestaDto);
    }
};
exports.ImportacionesController = ImportacionesController;
__decorate([
    (0, common_1.Post)('periodos/:periodoId/importaciones'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('archivo', {
        limits: { fileSize: LIMITE_TAMANO_ARCHIVO_BYTES },
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['archivo'],
            properties: { archivo: { type: 'string', format: 'binary' } },
        },
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Sube un .xlsx, lo valida y devuelve el desglose fila por fila SIN persistir registros',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: parsear_importacion_respuesta_dto_1.ParsearImportacionRespuestaDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Periodo no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El periodo está cerrado' }),
    (0, swagger_1.ApiResponse)({
        status: 422,
        description: 'El archivo no tiene un formato reconocible',
    }),
    __param(0, (0, common_1.Param)('periodoId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, usuario_actual_decorator_1.UsuarioActual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, usuario_entity_1.Usuario]),
    __metadata("design:returntype", Promise)
], ImportacionesController.prototype, "parsear", null);
__decorate([
    (0, common_1.Post)('importaciones/:id/confirmar'),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirma una importación: persiste las filas válidas como registros de horas y las calcula',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: importacion_respuesta_dto_1.ImportacionRespuestaDto }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Importación o periodo no encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'La importación ya fue confirmada o el periodo está cerrado',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, confirmar_importacion_dto_1.ConfirmarImportacionDto]),
    __metadata("design:returntype", Promise)
], ImportacionesController.prototype, "confirmar", null);
__decorate([
    (0, common_1.Get)('periodos/:periodoId/importaciones'),
    (0, swagger_1.ApiOperation)({ summary: 'Historial de importaciones de un periodo' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [importacion_respuesta_dto_1.ImportacionRespuestaDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Periodo no encontrado' }),
    __param(0, (0, common_1.Param)('periodoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImportacionesController.prototype, "listar", null);
exports.ImportacionesController = ImportacionesController = __decorate([
    (0, swagger_1.ApiTags)('importaciones'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(parsear_importacion_use_case_1.ParsearImportacionUseCase)),
    __param(1, (0, common_1.Inject)(confirmar_importacion_use_case_1.ConfirmarImportacionUseCase)),
    __param(2, (0, common_1.Inject)(listar_importaciones_use_case_1.ListarImportacionesUseCase)),
    __metadata("design:paramtypes", [parsear_importacion_use_case_1.ParsearImportacionUseCase,
        confirmar_importacion_use_case_1.ConfirmarImportacionUseCase,
        listar_importaciones_use_case_1.ListarImportacionesUseCase])
], ImportacionesController);
//# sourceMappingURL=importaciones.controller.js.map