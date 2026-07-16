"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empleado = void 0;
class Empleado {
    id;
    codigo;
    nombre;
    cedula;
    posicion;
    activo;
    constructor(id, codigo, nombre, cedula, posicion, activo) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.cedula = cedula;
        this.posicion = posicion;
        this.activo = activo;
    }
}
exports.Empleado = Empleado;
//# sourceMappingURL=empleado.entity.js.map