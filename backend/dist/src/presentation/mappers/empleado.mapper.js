"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aEmpleadoRespuestaDto = aEmpleadoRespuestaDto;
function aEmpleadoRespuestaDto(empleado) {
    return {
        id: empleado.id,
        codigo: empleado.codigo,
        nombre: empleado.nombre,
        cedula: empleado.cedula,
        posicion: empleado.posicion,
        activo: empleado.activo,
    };
}
//# sourceMappingURL=empleado.mapper.js.map