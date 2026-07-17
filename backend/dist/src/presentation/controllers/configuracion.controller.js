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
exports.ConfiguracionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const actualizar_configuracion_use_case_1 = require("../../application/use-cases/configuracion/actualizar-configuracion.use-case");
const obtener_configuracion_use_case_1 = require("../../application/use-cases/configuracion/obtener-configuracion.use-case");
const rol_usuario_enum_1 = require("../../domain/enums/rol-usuario.enum");
const actualizar_configuracion_dto_1 = require("../dtos/configuracion/actualizar-configuracion.dto");
const configuracion_respuesta_dto_1 = require("../dtos/configuracion/configuracion-respuesta.dto");
const roles_decorator_1 = require("../decorators/roles.decorator");
let ConfiguracionController = class ConfiguracionController {
    obtenerConfiguracion;
    actualizarConfiguracion;
    constructor(obtenerConfiguracion, actualizarConfiguracion) {
        this.obtenerConfiguracion = obtenerConfiguracion;
        this.actualizarConfiguracion = actualizarConfiguracion;
    }
    ejecutarObtener() {
        return this.obtenerConfiguracion.ejecutar();
    }
    ejecutarActualizar(dto) {
        const cambios = Object.fromEntries(Object.entries(dto).filter(([, valor]) => valor !== undefined));
        return this.actualizarConfiguracion.ejecutar(cambios);
    }
};
exports.ConfiguracionController = ConfiguracionController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene los parámetros de cálculo vigentes' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: configuracion_respuesta_dto_1.ConfiguracionRespuestaDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "ejecutarObtener", null);
__decorate([
    (0, common_1.Patch)(),
    (0, roles_decorator_1.Roles)(rol_usuario_enum_1.RolUsuario.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Actualiza uno o más parámetros de cálculo (solo ADMIN)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: configuracion_respuesta_dto_1.ConfiguracionRespuestaDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [actualizar_configuracion_dto_1.ActualizarConfiguracionDto]),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "ejecutarActualizar", null);
exports.ConfiguracionController = ConfiguracionController = __decorate([
    (0, swagger_1.ApiTags)('configuracion'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('configuracion'),
    __param(0, (0, common_1.Inject)(obtener_configuracion_use_case_1.ObtenerConfiguracionUseCase)),
    __param(1, (0, common_1.Inject)(actualizar_configuracion_use_case_1.ActualizarConfiguracionUseCase)),
    __metadata("design:paramtypes", [obtener_configuracion_use_case_1.ObtenerConfiguracionUseCase,
        actualizar_configuracion_use_case_1.ActualizarConfiguracionUseCase])
], ConfiguracionController);
//# sourceMappingURL=configuracion.controller.js.map