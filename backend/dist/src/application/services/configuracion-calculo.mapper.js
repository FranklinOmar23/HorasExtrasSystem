"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsearConfiguracionCalculo = parsearConfiguracionCalculo;
const decimal_js_1 = __importDefault(require("decimal.js"));
function parsearConfiguracionCalculo(configuracion) {
    return {
        divisorSalario: new decimal_js_1.default(configuracion.divisor_salario),
        parametrosMotor: {
            horasJornada: new decimal_js_1.default(configuracion.horas_jornada),
            horasAlmuerzo: new decimal_js_1.default(configuracion.horas_almuerzo),
            entradaSabado: configuracion.entrada_sabado,
            salidaSabado: configuracion.salida_sabado,
            inicioNocturna: configuracion.inicio_nocturna,
            toleranciaMinutos: Number(configuracion.tolerancia_minutos),
        },
    };
}
//# sourceMappingURL=configuracion-calculo.mapper.js.map