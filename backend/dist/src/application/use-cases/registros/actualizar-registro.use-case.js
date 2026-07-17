"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarRegistroUseCase = void 0;
const periodo_cerrado_error_1 = require("../../../domain/errors/periodo-cerrado.error");
const registro_horas_no_encontrado_error_1 = require("../../../domain/errors/registro-horas-no-encontrado.error");
class ActualizarRegistroUseCase {
    periodoRepository;
    registroHorasRepository;
    calcularDesglose;
    constructor(periodoRepository, registroHorasRepository, calcularDesglose) {
        this.periodoRepository = periodoRepository;
        this.registroHorasRepository = registroHorasRepository;
        this.calcularDesglose = calcularDesglose;
    }
    async ejecutar(id, comando) {
        const existente = await this.registroHorasRepository.buscarPorId(id);
        if (!existente) {
            throw new registro_horas_no_encontrado_error_1.RegistroHorasNoEncontradoError(id);
        }
        const periodo = await this.periodoRepository.buscarPorId(existente.registro.periodoId);
        if (periodo?.estaCerrado()) {
            throw new periodo_cerrado_error_1.PeriodoCerradoError(existente.registro.periodoId);
        }
        const fecha = comando.fecha ?? existente.registro.fecha;
        const horaEntrada = comando.horaEntrada ?? existente.registro.horaEntrada;
        const horaSalida = comando.horaSalida ?? existente.registro.horaSalida;
        const comentario = comando.comentario !== undefined
            ? comando.comentario
            : existente.registro.comentario;
        const filas = await this.calcularDesglose.calcular(existente.registro.empleadoId, fecha, horaEntrada, horaSalida);
        return this.registroHorasRepository.actualizar(id, { fecha, horaEntrada, horaSalida, comentario }, filas);
    }
}
exports.ActualizarRegistroUseCase = ActualizarRegistroUseCase;
//# sourceMappingURL=actualizar-registro.use-case.js.map