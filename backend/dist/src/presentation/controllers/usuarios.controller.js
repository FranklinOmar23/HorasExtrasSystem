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
exports.UsuariosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const actualizar_usuario_use_case_1 = require("../../application/use-cases/usuarios/actualizar-usuario.use-case");
const crear_usuario_use_case_1 = require("../../application/use-cases/usuarios/crear-usuario.use-case");
const listar_usuarios_use_case_1 = require("../../application/use-cases/usuarios/listar-usuarios.use-case");
const rol_usuario_enum_1 = require("../../domain/enums/rol-usuario.enum");
const roles_decorator_1 = require("../decorators/roles.decorator");
const actualizar_usuario_dto_1 = require("../dtos/usuarios/actualizar-usuario.dto");
const crear_usuario_dto_1 = require("../dtos/usuarios/crear-usuario.dto");
const usuario_respuesta_dto_1 = require("../dtos/usuarios/usuario-respuesta.dto");
const usuario_mapper_1 = require("../mappers/usuario.mapper");
let UsuariosController = class UsuariosController {
    listarUsuarios;
    crearUsuario;
    actualizarUsuario;
    constructor(listarUsuarios, crearUsuario, actualizarUsuario) {
        this.listarUsuarios = listarUsuarios;
        this.crearUsuario = crearUsuario;
        this.actualizarUsuario = actualizarUsuario;
    }
    async listar() {
        const usuarios = await this.listarUsuarios.ejecutar();
        return usuarios.map(usuario_mapper_1.aUsuarioRespuestaDto);
    }
    async crear(dto) {
        const usuario = await this.crearUsuario.ejecutar(dto);
        return (0, usuario_mapper_1.aUsuarioRespuestaDto)(usuario);
    }
    async actualizar(id, dto) {
        const usuario = await this.actualizarUsuario.ejecutar(id, dto);
        return (0, usuario_mapper_1.aUsuarioRespuestaDto)(usuario);
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lista los usuarios del sistema (solo ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [usuario_respuesta_dto_1.UsuarioRespuestaDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "listar", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crea un usuario (solo ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: usuario_respuesta_dto_1.UsuarioRespuestaDto }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe un usuario con ese email',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_usuario_dto_1.CrearUsuarioDto]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualiza un usuario (solo ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: usuario_respuesta_dto_1.UsuarioRespuestaDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_usuario_dto_1.ActualizarUsuarioDto]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "actualizar", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, swagger_1.ApiTags)('usuarios'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(rol_usuario_enum_1.RolUsuario.ADMIN),
    (0, common_1.Controller)('usuarios'),
    __param(0, (0, common_1.Inject)(listar_usuarios_use_case_1.ListarUsuariosUseCase)),
    __param(1, (0, common_1.Inject)(crear_usuario_use_case_1.CrearUsuarioUseCase)),
    __param(2, (0, common_1.Inject)(actualizar_usuario_use_case_1.ActualizarUsuarioUseCase)),
    __metadata("design:paramtypes", [listar_usuarios_use_case_1.ListarUsuariosUseCase,
        crear_usuario_use_case_1.CrearUsuarioUseCase,
        actualizar_usuario_use_case_1.ActualizarUsuarioUseCase])
], UsuariosController);
//# sourceMappingURL=usuarios.controller.js.map