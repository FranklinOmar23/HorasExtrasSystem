"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aFeriadoRespuestaDto = aFeriadoRespuestaDto;
function aFeriadoRespuestaDto(feriado) {
    return {
        id: feriado.id,
        fecha: feriado.fecha.toISOString().slice(0, 10),
        descripcion: feriado.descripcion,
    };
}
//# sourceMappingURL=feriado.mapper.js.map