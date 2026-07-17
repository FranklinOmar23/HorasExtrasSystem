"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aTipoHoraExtraRespuestaDto = aTipoHoraExtraRespuestaDto;
function aTipoHoraExtraRespuestaDto(tipo) {
    return {
        id: tipo.id,
        codigo: tipo.codigo,
        nombre: tipo.nombre,
        porcentaje: tipo.porcentaje.toFixed(2),
        activo: tipo.activo,
    };
}
//# sourceMappingURL=tipo-hora-extra.mapper.js.map