"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diaAnterior = diaAnterior;
function diaAnterior(fecha) {
    const resultado = new Date(fecha);
    resultado.setUTCDate(resultado.getUTCDate() - 1);
    return resultado;
}
//# sourceMappingURL=fecha.util.js.map