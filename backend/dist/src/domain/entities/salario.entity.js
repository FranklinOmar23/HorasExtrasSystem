"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salario = void 0;
class Salario {
    id;
    empleadoId;
    montoMensual;
    vigenteDesde;
    vigenteHasta;
    constructor(id, empleadoId, montoMensual, vigenteDesde, vigenteHasta) {
        this.id = id;
        this.empleadoId = empleadoId;
        this.montoMensual = montoMensual;
        this.vigenteDesde = vigenteDesde;
        this.vigenteHasta = vigenteHasta;
    }
    estaVigenteEn(fecha) {
        if (this.vigenteDesde > fecha) {
            return false;
        }
        return this.vigenteHasta === null || this.vigenteHasta >= fecha;
    }
}
exports.Salario = Salario;
//# sourceMappingURL=salario.entity.js.map