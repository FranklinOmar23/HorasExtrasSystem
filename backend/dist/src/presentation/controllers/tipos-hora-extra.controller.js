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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposHoraExtraController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decimal_js_1 = __importDefault(require("decimal.js"));
const actualizar_tipo_hora_extra_use_case_1 = require("../../application/use-cases/tipos-hora-extra/actualizar-tipo-hora-extra.use-case");
const listar_tipos_hora_extra_use_case_1 = require("../../application/use-cases/tipos-hora-extra/listar-tipos-hora-extra.use-case");
const rol_usuario_enum_1 = require("../../domain/enums/rol-usuario.enum");
const roles_decorator_1 = require("../decorators/roles.decorator");
const actualizar_tipo_hora_extra_dto_1 = require("../dtos/tipos-hora-extra/actualizar-tipo-hora-extra.dto");
const tipo_hora_extra_respuesta_dto_1 = require("../dtos/tipos-hora-extra/tipo-hora-extra-respuesta.dto");
const tipo_hora_extra_mapper_1 = require("../mappers/tipo-hora-extra.mapper");
let TiposHoraExtraController = class TiposHoraExtraController {
    listarTipos;
    actualizarTipo;
    constructor(listarTipos, actualizarTipo) {
        this.listarTipos = listarTipos;
        this.actualizarTipo = actualizarTipo;
    }
    async listar() {
        const tipos = await this.listarTipos.ejecutar();
        return tipos.map(tipo_hora_extra_mapper_1.aTipoHoraExtraRespuestaDto);
    }
    async actualizar(id, dto) {
        const tipo = await this.actualizarTipo.ejecutar(id, {
            nombre: dto.nombre,
            porcentaje: dto.porcentaje !== undefined ? new decimal_js_1.default(dto.porcentaje) : undefined,
            activo: dto.activo,
        });
        return (0, tipo_hora_extra_mapper_1.aTipoHoraExtraRespuestaDto)(tipo);
    }
};
exports.TiposHoraExtraController = TiposHoraExtraController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lista los tipos de hora extra y su porcentaje' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [tipo_hora_extra_respuesta_dto_1.TipoHoraExtraRespuestaDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TiposHoraExtraController.prototype, "listar", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(rol_usuario_enum_1.RolUsuario.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Actualiza un tipo de hora extra (solo ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: tipo_hora_extra_respuesta_dto_1.TipoHoraExtraRespuestaDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tipo de hora extra no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_tipo_hora_extra_dto_1.ActualizarTipoHoraExtraDto]),
    __metadata("design:returntype", Promise)
], TiposHoraExtraController.prototype, "actualizar", null);
exports.TiposHoraExtraController = TiposHoraExtraController = __decorate([
    (0, swagger_1.ApiTags)('tipos-hora-extra'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('tipos-hora-extra'),
    __param(0, (0, common_1.Inject)(listar_tipos_hora_extra_use_case_1.ListarTiposHoraExtraUseCase)),
    __param(1, (0, common_1.Inject)(actualizar_tipo_hora_extra_use_case_1.ActualizarTipoHoraExtraUseCase)),
    __metadata("design:paramtypes", [listar_tipos_hora_extra_use_case_1.ListarTiposHoraExtraUseCase,
        actualizar_tipo_hora_extra_use_case_1.ActualizarTipoHoraExtraUseCase])
], TiposHoraExtraController);
//# sourceMappingURL=tipos-hora-extra.controller.js.map