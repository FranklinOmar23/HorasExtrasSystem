"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aImportacionRespuestaDto = aImportacionRespuestaDto;
exports.aFilaImportacionRespuestaDto = aFilaImportacionRespuestaDto;
function aFechaISO(fecha) {
    return fecha.toISOString().slice(0, 10);
}
function aImportacionRespuestaDto(importacion) {
    return {
        id: importacion.id,
        periodoId: importacion.periodoId,
        usuarioId: importacion.usuarioId,
        archivo: importacion.archivo,
        filasOk: importacion.filasOk,
        filasAdvertencia: importacion.filasAdvertencia,
        filasError: importacion.filasError,
        importadoEn: importacion.importadoEn.toISOString(),
        confirmadaEn: importacion.confirmadaEn
            ? importacion.confirmadaEn.toISOString()
            : null,
    };
}
function aFilaImportacionRespuestaDto(fila) {
    return {
        linea: fila.linea,
        fecha: fila.fecha ? aFechaISO(fila.fecha) : null,
        codigo: fila.codigo,
        nombre: fila.nombre,
        entrada: fila.horaEntrada,
        salida: fila.horaSalida,
        estado: fila.estado,
        mensajes: fila.mensajes,
    };
}
//# sourceMappingURL=importacion.mapper.js.map