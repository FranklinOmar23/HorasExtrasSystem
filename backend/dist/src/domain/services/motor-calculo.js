"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MotorCalculo = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
const tipo_hora_extra_codigo_enum_1 = require("../enums/tipo-hora-extra-codigo.enum");
const hora_util_1 = require("./hora.util");
class MotorCalculo {
    tiposHoraExtra;
    constructor(tiposHoraExtra) {
        this.tiposHoraExtra = tiposHoraExtra;
    }
    calcular(entrada, parametros) {
        const filas = [];
        const { entrada: entradaMin, salida: salidaMin } = (0, hora_util_1.entradaSalidaAjustadas)(entrada.horaEntrada, entrada.horaSalida);
        const minutosBrutos = salidaMin - entradaMin;
        if (minutosBrutos <= 0) {
            return filas;
        }
        const diaSemana = entrada.fecha.getUTCDay();
        if (entrada.esFeriado) {
            this.agregarFila(filas, tipo_hora_extra_codigo_enum_1.TipoHoraExtraCodigo.FERIADO, minutosBrutos, entrada.salarioHoraUsado);
        }
        else if (diaSemana === 0) {
            this.agregarFila(filas, tipo_hora_extra_codigo_enum_1.TipoHoraExtraCodigo.HE_100, minutosBrutos, entrada.salarioHoraUsado);
        }
        else if (diaSemana === 6) {
            const presupuesto = (0, hora_util_1.duracionMinutos)(parametros.entradaSabado, parametros.salidaSabado) +
                parametros.toleranciaMinutos;
            const minutosExtra = Math.max(0, minutosBrutos - presupuesto);
            if (minutosExtra > 0) {
                this.agregarFila(filas, tipo_hora_extra_codigo_enum_1.TipoHoraExtraCodigo.HE_100, minutosExtra, entrada.salarioHoraUsado);
            }
        }
        else {
            const minutosAlmuerzo = parametros.horasAlmuerzo.times(60).toNumber();
            const minutosNetos = Math.max(0, minutosBrutos - minutosAlmuerzo);
            const presupuesto = parametros.horasJornada.times(60).toNumber() +
                parametros.toleranciaMinutos;
            const minutosExtra = Math.max(0, minutosNetos - presupuesto);
            if (minutosExtra > 0) {
                this.agregarFila(filas, tipo_hora_extra_codigo_enum_1.TipoHoraExtraCodigo.HE_35, minutosExtra, entrada.salarioHoraUsado);
            }
        }
        const minutosNocturnos = (0, hora_util_1.minutosDesdeReferencia)(entradaMin, salidaMin, parametros.inicioNocturna);
        if (minutosNocturnos > 0) {
            this.agregarFila(filas, tipo_hora_extra_codigo_enum_1.TipoHoraExtraCodigo.NOCTURNA_15, minutosNocturnos, entrada.salarioHoraUsado);
        }
        return filas;
    }
    buscarTipo(codigo) {
        const tipo = this.tiposHoraExtra.find((t) => t.codigo === codigo && t.activo);
        if (!tipo) {
            throw new Error(`El tipo de hora extra ${codigo} no está configurado o está inactivo.`);
        }
        return tipo;
    }
    agregarFila(filas, codigo, minutos, salarioHoraUsado) {
        const tipo = this.buscarTipo(codigo);
        const cantidadHoras = new decimal_js_1.default(minutos).dividedBy(60);
        const monto = salarioHoraUsado
            .times(cantidadHoras)
            .times(tipo.multiplicador());
        filas.push({
            tipoHoraId: tipo.id,
            tipoHoraCodigo: tipo.codigo,
            cantidadHoras,
            porcentajeAplicado: tipo.porcentaje,
            salarioHoraUsado,
            monto,
        });
    }
}
exports.MotorCalculo = MotorCalculo;
//# sourceMappingURL=motor-calculo.js.map