"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosModule = void 0;
const common_1 = require("@nestjs/common");
const password_hasher_port_1 = require("../../application/ports/password-hasher.port");
const usuario_repository_port_1 = require("../../application/ports/usuario.repository.port");
const actualizar_usuario_use_case_1 = require("../../application/use-cases/usuarios/actualizar-usuario.use-case");
const crear_usuario_use_case_1 = require("../../application/use-cases/usuarios/crear-usuario.use-case");
const listar_usuarios_use_case_1 = require("../../application/use-cases/usuarios/listar-usuarios.use-case");
const usuarios_controller_1 = require("../controllers/usuarios.controller");
const auth_module_1 = require("./auth.module");
let UsuariosModule = class UsuariosModule {
};
exports.UsuariosModule = UsuariosModule;
exports.UsuariosModule = UsuariosModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [usuarios_controller_1.UsuariosController],
        providers: [
            {
                provide: listar_usuarios_use_case_1.ListarUsuariosUseCase,
                useFactory: (repo) => new listar_usuarios_use_case_1.ListarUsuariosUseCase(repo),
                inject: [usuario_repository_port_1.USUARIO_REPOSITORY],
            },
            {
                provide: crear_usuario_use_case_1.CrearUsuarioUseCase,
                useFactory: (repo, hasher) => new crear_usuario_use_case_1.CrearUsuarioUseCase(repo, hasher),
                inject: [usuario_repository_port_1.USUARIO_REPOSITORY, password_hasher_port_1.PASSWORD_HASHER],
            },
            {
                provide: actualizar_usuario_use_case_1.ActualizarUsuarioUseCase,
                useFactory: (repo, hasher) => new actualizar_usuario_use_case_1.ActualizarUsuarioUseCase(repo, hasher),
                inject: [usuario_repository_port_1.USUARIO_REPOSITORY, password_hasher_port_1.PASSWORD_HASHER],
            },
        ],
    })
], UsuariosModule);
//# sourceMappingURL=usuarios.module.js.map