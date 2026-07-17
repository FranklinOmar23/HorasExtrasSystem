"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calculo = void 0;
class Calculo {
    id;
    registroId;
    tipoHoraId;
    tipoHoraCodigo;
    cantidadHoras;
    porcentajeAplicado;
    salarioHoraUsado;
    monto;
    calculadoEn;
    constructor(id, registroId, tipoHoraId, tipoHoraCodigo, cantidadHoras, porcentajeAplicado, salarioHoraUsado, monto, calculadoEn) {
        this.id = id;
        this.registroId = registroId;
        this.tipoHoraId = tipoHoraId;
        this.tipoHoraCodigo = tipoHoraCodigo;
        this.cantidadHoras = cantidadHoras;
        this.porcentajeAplicado = porcentajeAplicado;
        this.salarioHoraUsado = salarioHoraUsado;
        this.monto = monto;
        this.calculadoEn = calculadoEn;
    }
}
exports.Calculo = Calculo;
//# sourceMappingURL=calculo.entity.js.map