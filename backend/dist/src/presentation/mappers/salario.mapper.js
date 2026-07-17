"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aSalarioRespuestaDto = aSalarioRespuestaDto;
function aFechaISO(fecha) {
    return fecha.toISOString().slice(0, 10);
}
function aSalarioRespuestaDto(salario) {
    return {
        id: salario.id,
        empleadoId: salario.empleadoId,
        montoMensual: salario.montoMensual.toFixed(2),
        vigenteDesde: aFechaISO(salario.vigenteDesde),
        vigenteHasta: salario.vigenteHasta ? aFechaISO(salario.vigenteHasta) : null,
    };
}
//# sourceMappingURL=salario.mapper.js.map