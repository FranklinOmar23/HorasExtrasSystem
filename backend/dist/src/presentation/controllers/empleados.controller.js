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
exports.EmpleadosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crear_empleado_use_case_1 = require("../../application/use-cases/empleados/crear-empleado.use-case");
const listar_empleados_use_case_1 = require("../../application/use-cases/empleados/listar-empleados.use-case");
const rol_usuario_enum_1 = require("../../domain/enums/rol-usuario.enum");
const roles_decorator_1 = require("../decorators/roles.decorator");
const crear_empleado_dto_1 = require("../dtos/empleados/crear-empleado.dto");
const empleado_respuesta_dto_1 = require("../dtos/empleados/empleado-respuesta.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
let EmpleadosController = class EmpleadosController {
    listarEmpleados;
    crearEmpleado;
    constructor(listarEmpleados, crearEmpleado) {
        this.listarEmpleados = listarEmpleados;
        this.crearEmpleado = crearEmpleado;
    }
    listar() {
        return this.listarEmpleados.ejecutar();
    }
    crear(dto) {
        return this.crearEmpleado.ejecutar({
            codigo: dto.codigo,
            nombre: dto.nombre,
            cargo: dto.cargo ?? null,
        });
    }
};
exports.EmpleadosController = EmpleadosController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lista todos los empleados' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [empleado_respuesta_dto_1.EmpleadoRespuestaDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmpleadosController.prototype, "listar", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(rol_usuario_enum_1.RolUsuario.ADMIN, rol_usuario_enum_1.RolUsuario.RRHH),
    (0, swagger_1.ApiOperation)({ summary: 'Crea un nuevo empleado' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: empleado_respuesta_dto_1.EmpleadoRespuestaDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_empleado_dto_1.CrearEmpleadoDto]),
    __metadata("design:returntype", Promise)
], EmpleadosController.prototype, "crear", null);
exports.EmpleadosController = EmpleadosController = __decorate([
    (0, swagger_1.ApiTags)('empleados'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('empleados'),
    __param(0, (0, common_1.Inject)(listar_empleados_use_case_1.ListarEmpleadosUseCase)),
    __param(1, (0, common_1.Inject)(crear_empleado_use_case_1.CrearEmpleadoUseCase)),
    __metadata("design:paramtypes", [listar_empleados_use_case_1.ListarEmpleadosUseCase,
        crear_empleado_use_case_1.CrearEmpleadoUseCase])
], EmpleadosController);
//# sourceMappingURL=empleados.controller.js.map