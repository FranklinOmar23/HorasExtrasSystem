"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistroHoras = void 0;
class RegistroHoras {
    id;
    periodoId;
    empleadoId;
    fecha;
    horaEntrada;
    horaSalida;
    origen;
    importacionId;
    comentario;
    constructor(id, periodoId, empleadoId, fecha, horaEntrada, horaSalida, origen, importacionId, comentario) {
        this.id = id;
        this.periodoId = periodoId;
        this.empleadoId = empleadoId;
        this.fecha = fecha;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
        this.origen = origen;
        this.importacionId = importacionId;
        this.comentario = comentario;
    }
}
exports.RegistroHoras = RegistroHoras;
//# sourceMappingURL=registro-horas.entity.js.map