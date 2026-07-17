"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aUsuarioRespuestaDto = aUsuarioRespuestaDto;
function aUsuarioRespuestaDto(usuario) {
    return {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo,
    };
}
//# sourceMappingURL=usuario.mapper.js.map