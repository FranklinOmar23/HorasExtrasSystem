"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearRegistroUseCase = void 0;
const empleado_no_encontrado_error_1 = require("../../../domain/errors/empleado-no-encontrado.error");
const periodo_cerrado_error_1 = require("../../../domain/errors/periodo-cerrado.error");
const periodo_no_encontrado_error_1 = require("../../../domain/errors/periodo-no-encontrado.error");
const origen_registro_enum_1 = require("../../../domain/enums/origen-registro.enum");
class CrearRegistroUseCase {
    periodoRepository;
    empleadoRepository;
    registroHorasRepository;
    calcularDesglose;
    constructor(periodoRepository, empleadoRepository, registroHorasRepository, calcularDesglose) {
        this.periodoRepository = periodoRepository;
        this.empleadoRepository = empleadoRepository;
        this.registroHorasRepository = registroHorasRepository;
        this.calcularDesglose = calcularDesglose;
    }
    async ejecutar(comando) {
        const periodo = await this.periodoRepository.buscarPorId(comando.periodoId);
        if (!periodo) {
            throw new periodo_no_encontrado_error_1.PeriodoNoEncontradoError(comando.periodoId);
        }
        if (periodo.estaCerrado()) {
            throw new periodo_cerrado_error_1.PeriodoCerradoError(comando.periodoId);
        }
        const empleado = await this.empleadoRepository.buscarPorId(comando.empleadoId);
        if (!empleado) {
            throw new empleado_no_encontrado_error_1.EmpleadoNoEncontradoError(comando.empleadoId);
        }
        const filas = await this.calcularDesglose.calcular(comando.empleadoId, comando.fecha, comando.horaEntrada, comando.horaSalida);
        return this.registroHorasRepository.crear({
            periodoId: comando.periodoId,
            empleadoId: comando.empleadoId,
            fecha: comando.fecha,
            horaEntrada: comando.horaEntrada,
            horaSalida: comando.horaSalida,
            origen: origen_registro_enum_1.OrigenRegistro.MANUAL,
            importacionId: null,
            comentario: comando.comentario,
        }, filas);
    }
}
exports.CrearRegistroUseCase = CrearRegistroUseCase;
//# sourceMappingURL=crear-registro.use-case.js.map