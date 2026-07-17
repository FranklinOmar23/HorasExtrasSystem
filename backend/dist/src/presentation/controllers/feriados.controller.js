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
exports.FeriadosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crear_feriado_use_case_1 = require("../../application/use-cases/feriados/crear-feriado.use-case");
const eliminar_feriado_use_case_1 = require("../../application/use-cases/feriados/eliminar-feriado.use-case");
const listar_feriados_use_case_1 = require("../../application/use-cases/feriados/listar-feriados.use-case");
const rol_usuario_enum_1 = require("../../domain/enums/rol-usuario.enum");
const roles_decorator_1 = require("../decorators/roles.decorator");
const crear_feriado_dto_1 = require("../dtos/feriados/crear-feriado.dto");
const feriado_respuesta_dto_1 = require("../dtos/feriados/feriado-respuesta.dto");
const listar_feriados_query_dto_1 = require("../dtos/feriados/listar-feriados-query.dto");
const feriado_mapper_1 = require("../mappers/feriado.mapper");
let FeriadosController = class FeriadosController {
    listarFeriados;
    crearFeriado;
    eliminarFeriado;
    constructor(listarFeriados, crearFeriado, eliminarFeriado) {
        this.listarFeriados = listarFeriados;
        this.crearFeriado = crearFeriado;
        this.eliminarFeriado = eliminarFeriado;
    }
    async listar(query) {
        const feriados = await this.listarFeriados.ejecutar(query.anio);
        return feriados.map(feriado_mapper_1.aFeriadoRespuestaDto);
    }
    async crear(dto) {
        const feriado = await this.crearFeriado.ejecutar({
            fecha: new Date(dto.fecha),
            descripcion: dto.descripcion,
        });
        return (0, feriado_mapper_1.aFeriadoRespuestaDto)(feriado);
    }
    async eliminar(id) {
        await this.eliminarFeriado.ejecutar(id);
    }
};
exports.FeriadosController = FeriadosController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lista feriados, opcionalmente filtrados por año' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [feriado_respuesta_dto_1.FeriadoRespuestaDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listar_feriados_query_dto_1.ListarFeriadosQueryDto]),
    __metadata("design:returntype", Promise)
], FeriadosController.prototype, "listar", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(rol_usuario_enum_1.RolUsuario.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Crea un feriado (solo ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: feriado_respuesta_dto_1.FeriadoRespuestaDto }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe un feriado en esa fecha',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_feriado_dto_1.CrearFeriadoDto]),
    __metadata("design:returntype", Promise)
], FeriadosController.prototype, "crear", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(rol_usuario_enum_1.RolUsuario.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Elimina un feriado (solo ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Eliminado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feriado no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeriadosController.prototype, "eliminar", null);
exports.FeriadosController = FeriadosController = __decorate([
    (0, swagger_1.ApiTags)('feriados'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('feriados'),
    __param(0, (0, common_1.Inject)(listar_feriados_use_case_1.ListarFeriadosUseCase)),
    __param(1, (0, common_1.Inject)(crear_feriado_use_case_1.CrearFeriadoUseCase)),
    __param(2, (0, common_1.Inject)(eliminar_feriado_use_case_1.EliminarFeriadoUseCase)),
    __metadata("design:paramtypes", [listar_feriados_use_case_1.ListarFeriadosUseCase,
        crear_feriado_use_case_1.CrearFeriadoUseCase,
        eliminar_feriado_use_case_1.EliminarFeriadoUseCase])
], FeriadosController);
//# sourceMappingURL=feriados.controller.js.map