"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.construirReporteExcel = construirReporteExcel;
const XLSX = __importStar(require("xlsx"));
function aFechaISO(fecha) {
    return fecha.toISOString().slice(0, 10);
}
const ENCABEZADOS = [
    'Código',
    'Nombre',
    'Salario/hora',
    'HE 35% (h)',
    'HE 35% (RD$)',
    'HE 100% (h)',
    'HE 100% (RD$)',
    'Nocturna 15% (h)',
    'Nocturna 15% (RD$)',
    'Feriado (h)',
    'Feriado (RD$)',
    'Total (RD$)',
];
function construirReporteExcel(reporte) {
    const filas = reporte.filas.map((fila) => [
        fila.empleado.codigo,
        fila.empleado.nombre,
        fila.salarioHora.toNumber(),
        fila.horas.he35.toNumber(),
        fila.montos.he35.toNumber(),
        fila.horas.he100.toNumber(),
        fila.montos.he100.toNumber(),
        fila.horas.nocturna.toNumber(),
        fila.montos.nocturna.toNumber(),
        fila.horas.feriado.toNumber(),
        fila.montos.feriado.toNumber(),
        fila.total.toNumber(),
    ]);
    const filaGranTotal = [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'GRAN TOTAL',
        reporte.granTotal.toNumber(),
    ];
    const hoja = XLSX.utils.aoa_to_sheet([
        [
            `Periodo ${aFechaISO(reporte.periodo.fechaInicio)} — ${aFechaISO(reporte.periodo.fechaFin)}`,
        ],
        [],
        ENCABEZADOS,
        ...filas,
        [],
        filaGranTotal,
    ]);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Reporte');
    return XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' });
}
//# sourceMappingURL=reporte-excel.builder.js.map