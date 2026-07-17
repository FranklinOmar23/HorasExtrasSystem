"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoHoraExtra = void 0;
const modo_valorizacion_enum_1 = require("../enums/modo-valorizacion.enum");
class TipoHoraExtra {
    id;
    codigo;
    nombre;
    porcentaje;
    modoValorizacion;
    activo;
    constructor(id, codigo, nombre, porcentaje, modoValorizacion, activo) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.porcentaje = porcentaje;
        this.modoValorizacion = modoValorizacion;
        this.activo = activo;
    }
    multiplicador() {
        const fraccion = this.porcentaje.dividedBy(100);
        return this.modoValorizacion === modo_valorizacion_enum_1.ModoValorizacion.COMPLETA
            ? fraccion.plus(1)
            : fraccion;
    }
}
exports.TipoHoraExtra = TipoHoraExtra;
//# sourceMappingURL=tipo-hora-extra.entity.js.map