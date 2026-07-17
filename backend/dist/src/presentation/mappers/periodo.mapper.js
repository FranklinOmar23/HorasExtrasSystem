"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aPeriodoRespuestaDto = aPeriodoRespuestaDto;
function aFechaISO(fecha) {
    return fecha.toISOString().slice(0, 10);
}
function aPeriodoRespuestaDto(periodo) {
    return {
        id: periodo.id,
        fechaInicio: aFechaISO(periodo.fechaInicio),
        fechaFin: aFechaISO(periodo.fechaFin),
        estado: periodo.estado,
        cerradoEn: periodo.cerradoEn ? periodo.cerradoEn.toISOString() : null,
        cerradoPorId: periodo.cerradoPorId,
    };
}
//# sourceMappingURL=periodo.mapper.js.map