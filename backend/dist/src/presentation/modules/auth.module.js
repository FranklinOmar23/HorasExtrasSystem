"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const password_hasher_port_1 = require("../../application/ports/password-hasher.port");
const token_port_1 = require("../../application/ports/token.port");
const usuario_repository_port_1 = require("../../application/ports/usuario.repository.port");
const autenticar_usuario_use_case_1 = require("../../application/use-cases/auth/autenticar-usuario.use-case");
const bcrypt_password_hasher_1 = require("../../infrastructure/auth/bcrypt-password-hasher");
const jwt_strategy_1 = require("../../infrastructure/auth/jwt.strategy");
const jwt_token_service_1 = require("../../infrastructure/auth/jwt-token.service");
const usuario_prisma_repository_1 = require("../../infrastructure/repositories/usuario.prisma.repository");
const auth_controller_1 = require("../controllers/auth.controller");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.getOrThrow('JWT_SECRET'),
                    signOptions: {
                        expiresIn: config.get('JWT_EXPIRES_IN', '8h'),
                    },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            jwt_strategy_1.JwtStrategy,
            { provide: usuario_repository_port_1.USUARIO_REPOSITORY, useClass: usuario_prisma_repository_1.UsuarioPrismaRepository },
            { provide: password_hasher_port_1.PASSWORD_HASHER, useClass: bcrypt_password_hasher_1.BcryptPasswordHasher },
            { provide: token_port_1.TOKEN_SERVICE, useClass: jwt_token_service_1.JwtTokenService },
            {
                provide: autenticar_usuario_use_case_1.AutenticarUsuarioUseCase,
                useFactory: (usuarioRepository, passwordHasher, tokenService) => new autenticar_usuario_use_case_1.AutenticarUsuarioUseCase(usuarioRepository, passwordHasher, tokenService),
                inject: [usuario_repository_port_1.USUARIO_REPOSITORY, password_hasher_port_1.PASSWORD_HASHER, token_port_1.TOKEN_SERVICE],
            },
        ],
        exports: [usuario_repository_port_1.USUARIO_REPOSITORY, password_hasher_port_1.PASSWORD_HASHER],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map