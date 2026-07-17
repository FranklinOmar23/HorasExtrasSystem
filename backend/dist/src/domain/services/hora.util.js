"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsearHora = parsearHora;
exports.entradaSalidaAjustadas = entradaSalidaAjustadas;
exports.duracionMinutos = duracionMinutos;
exports.minutosDesdeReferencia = minutosDesdeReferencia;
const MINUTOS_POR_DIA = 24 * 60;
function parsearHora(horaHHmm) {
    const [horas, minutos] = horaHHmm.split(':').map(Number);
    return horas * 60 + minutos;
}
function entradaSalidaAjustadas(horaEntrada, horaSalida) {
    const entrada = parsearHora(horaEntrada);
    let salida = parsearHora(horaSalida);
    if (salida < entrada) {
        salida += MINUTOS_POR_DIA;
    }
    return { entrada, salida };
}
function duracionMinutos(horaInicio, horaFin) {
    return parsearHora(horaFin) - parsearHora(horaInicio);
}
function minutosDesdeReferencia(entrada, salida, horaReferencia) {
    const referencia = parsearHora(horaReferencia);
    return Math.max(0, salida - Math.max(entrada, referencia));
}
//# sourceMappingURL=hora.util.js.map