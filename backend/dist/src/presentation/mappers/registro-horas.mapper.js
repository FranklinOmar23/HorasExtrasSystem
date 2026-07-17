"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aCalculoRespuestaDto = aCalculoRespuestaDto;
exports.aFilaCalculoRespuestaDto = aFilaCalculoRespuestaDto;
exports.aRegistroRespuestaDto = aRegistroRespuestaDto;
function aFechaISO(fecha) {
    return fecha.toISOString().slice(0, 10);
}
function aCalculoRespuestaDto(calculo) {
    return {
        tipoHoraCodigo: calculo.tipoHoraCodigo,
        cantidadHoras: calculo.cantidadHoras.toFixed(4),
        porcentajeAplicado: calculo.porcentajeAplicado.toFixed(2),
        salarioHoraUsado: calculo.salarioHoraUsado.toFixed(4),
        monto: calculo.monto.toFixed(2),
    };
}
function aFilaCalculoRespuestaDto(fila) {
    return {
        tipoHoraCodigo: fila.tipoHoraCodigo,
        cantidadHoras: fila.cantidadHoras.toFixed(4),
        porcentajeAplicado: fila.porcentajeAplicado.toFixed(2),
        salarioHoraUsado: fila.salarioHoraUsado.toFixed(4),
        monto: fila.monto.toFixed(2),
    };
}
function aRegistroRespuestaDto(registroConCalculos) {
    const { registro, calculos } = registroConCalculos;
    return {
        id: registro.id,
        periodoId: registro.periodoId,
        empleadoId: registro.empleadoId,
        fecha: aFechaISO(registro.fecha),
        horaEntrada: registro.horaEntrada,
        horaSalida: registro.horaSalida,
        origen: registro.origen,
        comentario: registro.comentario,
        calculos: calculos.map(aCalculoRespuestaDto),
    };
}
//# sourceMappingURL=registro-horas.mapper.js.map