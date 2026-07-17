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
exports.EmpleadosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decimal_js_1 = __importDefault(require("decimal.js"));
const actualizar_empleado_use_case_1 = require("../../application/use-cases/empleados/actualizar-empleado.use-case");
const crear_empleado_use_case_1 = require("../../application/use-cases/empleados/crear-empleado.use-case");
const listar_empleados_use_case_1 = require("../../application/use-cases/empleados/listar-empleados.use-case");
const obtener_empleado_use_case_1 = require("../../application/use-cases/empleados/obtener-empleado.use-case");
const crear_salario_use_case_1 = require("../../application/use-cases/salarios/crear-salario.use-case");
const listar_salarios_use_case_1 = require("../../application/use-cases/salarios/listar-salarios.use-case");
const actualizar_empleado_dto_1 = require("../dtos/empleados/actualizar-empleado.dto");
const crear_empleado_dto_1 = require("../dtos/empleados/crear-empleado.dto");
const empleado_respuesta_dto_1 = require("../dtos/empleados/empleado-respuesta.dto");
const listar_empleados_query_dto_1 = require("../dtos/empleados/listar-empleados-query.dto");
const crear_salario_dto_1 = require("../dtos/salarios/crear-salario.dto");
const salario_respuesta_dto_1 = require("../dtos/salarios/salario-respuesta.dto");
const empleado_mapper_1 = require("../mappers/empleado.mapper");
const salario_mapper_1 = require("../mappers/salario.mapper");
let EmpleadosController = class EmpleadosController {
    listarEmpleados;
    obtenerEmpleado;
    crearEmpleado;
    actualizarEmpleado;
    listarSalarios;
    crearSalario;
    constructor(listarEmpleados, obtenerEmpleado, crearEmpleado, actualizarEmpleado, listarSalarios, crearSalario) {
        this.listarEmpleados = listarEmpleados;
        this.obtenerEmpleado = obtenerEmpleado;
        this.crearEmpleado = crearEmpleado;
        this.actualizarEmpleado = actualizarEmpleado;
        this.listarSalarios = listarSalarios;
        this.crearSalario = crearSalario;
    }
    async listar(query) {
        const empleados = await this.listarEmpleados.ejecutar(query);
        return empleados.map(empleado_mapper_1.aEmpleadoRespuestaDto);
    }
    async obtener(id) {
        const empleado = await this.obtenerEmpleado.ejecutar(id);
        return (0, empleado_mapper_1.aEmpleadoRespuestaDto)(empleado);
    }
    async crear(dto) {
        const empleado = await this.crearEmpleado.ejecutar({
            codigo: dto.codigo,
            nombre: dto.nombre,
            cedula: dto.cedula ?? null,
            posicion: dto.posicion,
            salarioInicial: {
                montoMensual: new decimal_js_1.default(dto.salarioInicial.montoMensual),
                vigenteDesde: new Date(dto.salarioInicial.vigenteDesde),
            },
        });
        return (0, empleado_mapper_1.aEmpleadoRespuestaDto)(empleado);
    }
    async actualizar(id, dto) {
        const empleado = await this.actualizarEmpleado.ejecutar(id, dto);
        return (0, empleado_mapper_1.aEmpleadoRespuestaDto)(empleado);
    }
    async listarSalariosDelEmpleado(id) {
        const salarios = await this.listarSalarios.ejecutar(id);
        return salarios.map(salario_mapper_1.aSalarioRespuestaDto);
    }
    async crearSalarioDelEmpleado(id, dto) {
        const salario = await this.crearSalario.ejecutar(id, {
            montoMensual: new decimal_js_1.default(dto.montoMensual),
            vigenteDesde: new Date(dto.vigenteDesde),
        });
        return (0, salario_mapper_1.aSalarioRespuestaDto)(salario);
    }
};
exports.EmpleadosController = EmpleadosController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Lista empleados, con búsqueda opcional por código o nombre',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [empleado_respuesta_dto_1.EmpleadoRespuestaDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listar_empleados_query_dto_1.ListarEmpleadosQueryDto]),
    __metadata("design:returntype", Promise)
], EmpleadosController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene un empleado por id' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: empleado_respuesta_dto_1.EmpleadoRespuestaDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Empleado no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpleadosController.prototype, "obtener", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crea un empleado con su salario inicial' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: empleado_respuesta_dto_1.EmpleadoRespuestaDto }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Código o cédula duplicados' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_empleado_dto_1.CrearEmpleadoDto]),
    __metadata("design:returntype", Promise)
], EmpleadosController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualiza datos de un empleado' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: empleado_respuesta_dto_1.EmpleadoRespuestaDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Empleado no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Cédula duplicada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_empleado_dto_1.ActualizarEmpleadoDto]),
    __metadata("design:returntype", Promise)
], EmpleadosController.prototype, "actualizar", null);
__decorate([
    (0, common_1.Get)(':id/salarios'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista el historial de salarios de un empleado' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [salario_respuesta_dto_1.SalarioRespuestaDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Empleado no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpleadosController.prototype, "listarSalariosDelEmpleado", null);
__decorate([
    (0, common_1.Post)(':id/salarios'),
    (0, swagger_1.ApiOperation)({
        summary: 'Registra un nuevo salario y cierra la vigencia del anterior',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: salario_respuesta_dto_1.SalarioRespuestaDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Empleado no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, crear_salario_dto_1.CrearSalarioDto]),
    __metadata("design:returntype", Promise)
], EmpleadosController.prototype, "crearSalarioDelEmpleado", null);
exports.EmpleadosController = EmpleadosController = __decorate([
    (0, swagger_1.ApiTags)('empleados'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('empleados'),
    __param(0, (0, common_1.Inject)(listar_empleados_use_case_1.ListarEmpleadosUseCase)),
    __param(1, (0, common_1.Inject)(obtener_empleado_use_case_1.ObtenerEmpleadoUseCase)),
    __param(2, (0, common_1.Inject)(crear_empleado_use_case_1.CrearEmpleadoUseCase)),
    __param(3, (0, common_1.Inject)(actualizar_empleado_use_case_1.ActualizarEmpleadoUseCase)),
    __param(4, (0, common_1.Inject)(listar_salarios_use_case_1.ListarSalariosUseCase)),
    __param(5, (0, common_1.Inject)(crear_salario_use_case_1.CrearSalarioUseCase)),
    __metadata("design:paramtypes", [listar_empleados_use_case_1.ListarEmpleadosUseCase,
        obtener_empleado_use_case_1.ObtenerEmpleadoUseCase,
        crear_empleado_use_case_1.CrearEmpleadoUseCase,
        actualizar_empleado_use_case_1.ActualizarEmpleadoUseCase,
        listar_salarios_use_case_1.ListarSalariosUseCase,
        crear_salario_use_case_1.CrearSalarioUseCase])
], EmpleadosController);
//# sourceMappingURL=empleados.controller.js.map