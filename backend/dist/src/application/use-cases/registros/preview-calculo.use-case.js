"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewCalculoUseCase = void 0;
const empleado_no_encontrado_error_1 = require("../../../domain/errors/empleado-no-encontrado.error");
class PreviewCalculoUseCase {
    empleadoRepository;
    calcularDesglose;
    constructor(empleadoRepository, calcularDesglose) {
        this.empleadoRepository = empleadoRepository;
        this.calcularDesglose = calcularDesglose;
    }
    async ejecutar(comando) {
        const empleado = await this.empleadoRepository.buscarPorId(comando.empleadoId);
        if (!empleado) {
            throw new empleado_no_encontrado_error_1.EmpleadoNoEncontradoError(comando.empleadoId);
        }
        return this.calcularDesglose.calcular(comando.empleadoId, comando.fecha, comando.horaEntrada, comando.horaSalida);
    }
}
exports.PreviewCalculoUseCase = PreviewCalculoUseCase;
//# sourceMappingURL=preview-calculo.use-case.js.map