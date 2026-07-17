"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aReportePeriodoRespuestaDto = aReportePeriodoRespuestaDto;
exports.aReporteEmpleadoRespuestaDto = aReporteEmpleadoRespuestaDto;
exports.aHistoricoPeriodoDto = aHistoricoPeriodoDto;
const decimal_js_1 = __importDefault(require("decimal.js"));
const registro_horas_mapper_1 = require("./registro-horas.mapper");
const periodo_mapper_1 = require("./periodo.mapper");
function aFechaISO(fecha) {
    return fecha.toISOString().slice(0, 10);
}
function aDesgloseDto(desglose) {
    return {
        he35: desglose.he35.toFixed(2),
        he100: desglose.he100.toFixed(2),
        nocturna: desglose.nocturna.toFixed(2),
        feriado: desglose.feriado.toFixed(2),
    };
}
function aFilaDto(fila) {
    return {
        empleado: fila.empleado,
        salarioHora: fila.salarioHora.toFixed(4),
        horas: aDesgloseDto(fila.horas),
        montos: aDesgloseDto(fila.montos),
        total: fila.total.toFixed(2),
    };
}
function aReportePeriodoRespuestaDto(reporte) {
    return {
        periodo: (0, periodo_mapper_1.aPeriodoRespuestaDto)(reporte.periodo),
        filas: reporte.filas.map(aFilaDto),
        granTotal: reporte.granTotal.toFixed(2),
    };
}
function aReporteEmpleadoRespuestaDto(reporte) {
    const dias = reporte.registros
        .slice()
        .sort((a, b) => a.registro.fecha.getTime() - b.registro.fecha.getTime())
        .map(({ registro, calculos }) => ({
        fecha: aFechaISO(registro.fecha),
        horaEntrada: registro.horaEntrada,
        horaSalida: registro.horaSalida,
        calculos: calculos.map(registro_horas_mapper_1.aCalculoRespuestaDto),
        total: calculos
            .reduce((acumulado, c) => acumulado.plus(c.monto), new decimal_js_1.default(0))
            .toFixed(2),
    }));
    return {
        periodo: (0, periodo_mapper_1.aPeriodoRespuestaDto)(reporte.periodo),
        empleado: reporte.fila.empleado,
        salarioHora: reporte.fila.salarioHora.toFixed(4),
        dias,
        horas: aDesgloseDto(reporte.fila.horas),
        montos: aDesgloseDto(reporte.fila.montos),
        total: reporte.fila.total.toFixed(2),
    };
}
function aHistoricoPeriodoDto(historico) {
    return {
        periodo: (0, periodo_mapper_1.aPeriodoRespuestaDto)(historico.periodo),
        granTotal: historico.granTotal.toFixed(2),
    };
}
//# sourceMappingURL=reporte.mapper.js.map