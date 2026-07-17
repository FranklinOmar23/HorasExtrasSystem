"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Periodo = void 0;
const estado_periodo_enum_1 = require("../enums/estado-periodo.enum");
class Periodo {
    id;
    fechaInicio;
    fechaFin;
    estado;
    cerradoEn;
    cerradoPorId;
    constructor(id, fechaInicio, fechaFin, estado, cerradoEn, cerradoPorId) {
        this.id = id;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.cerradoEn = cerradoEn;
        this.cerradoPorId = cerradoPorId;
    }
    estaCerrado() {
        return this.estado === estado_periodo_enum_1.EstadoPeriodo.CERRADO;
    }
}
exports.Periodo = Periodo;
//# sourceMappingURL=periodo.entity.js.map