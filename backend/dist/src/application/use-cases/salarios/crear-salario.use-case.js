"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearSalarioUseCase = void 0;
const empleado_no_encontrado_error_1 = require("../../../domain/errors/empleado-no-encontrado.error");
const fecha_util_1 = require("../../../domain/services/fecha.util");
class CrearSalarioUseCase {
    empleadoRepository;
    salarioRepository;
    constructor(empleadoRepository, salarioRepository) {
        this.empleadoRepository = empleadoRepository;
        this.salarioRepository = salarioRepository;
    }
    async ejecutar(empleadoId, datos) {
        const empleado = await this.empleadoRepository.buscarPorId(empleadoId);
        if (!empleado) {
            throw new empleado_no_encontrado_error_1.EmpleadoNoEncontradoError(empleadoId);
        }
        return this.salarioRepository.crear(empleadoId, datos, (0, fecha_util_1.diaAnterior)(datos.vigenteDesde));
    }
}
exports.CrearSalarioUseCase = CrearSalarioUseCase;
//# sourceMappingURL=crear-salario.use-case.js.map