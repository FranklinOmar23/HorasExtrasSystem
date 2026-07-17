"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./infrastructure/prisma/prisma.module");
const jwt_auth_guard_1 = require("./presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("./presentation/guards/roles.guard");
const auth_module_1 = require("./presentation/modules/auth.module");
const configuracion_module_1 = require("./presentation/modules/configuracion.module");
const empleados_module_1 = require("./presentation/modules/empleados.module");
const health_module_1 = require("./presentation/modules/health.module");
const importaciones_module_1 = require("./presentation/modules/importaciones.module");
const periodos_module_1 = require("./presentation/modules/periodos.module");
const registros_module_1 = require("./presentation/modules/registros.module");
const reportes_module_1 = require("./presentation/modules/reportes.module");
const usuarios_module_1 = require("./presentation/modules/usuarios.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            empleados_module_1.EmpleadosModule,
            configuracion_module_1.ConfiguracionModule,
            periodos_module_1.PeriodosModule,
            registros_module_1.RegistrosModule,
            importaciones_module_1.ImportacionesModule,
            reportes_module_1.ReportesModule,
            usuarios_module_1.UsuariosModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map