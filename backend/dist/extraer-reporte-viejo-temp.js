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
const XLSX = __importStar(require("xlsx"));
const RUTA = 'C:\\Users\\Tecnologia\\Downloads\\FORMULARIO HORAS EXTRAS HARTEMANIA REPORTE DEL 1 AL 15 DE JUNIO 2026-.xlsx';
const EPOCA_EXCEL_MS = Date.UTC(1899, 11, 30);
const MS_POR_DIA = 24 * 60 * 60 * 1000;
function fechaISO(serial) {
    return new Date(EPOCA_EXCEL_MS + Math.floor(serial) * MS_POR_DIA).toISOString().slice(0, 10);
}
const wb = XLSX.readFile(RUTA);
const hoja = wb.Sheets['Reporte Diario viejo'];
const filas = XLSX.utils.sheet_to_json(hoja, { header: 1, raw: true, defval: null });
let inicioDatos = -1;
for (let i = 0; i < filas.length; i++) {
    const f = filas[i];
    if (typeof f[0] === 'number' && f[0] > 40000 && typeof f[2] === 'string') {
        inicioDatos = i;
        break;
    }
}
console.log('primera fila de datos en indice', inicioDatos, JSON.stringify(filas[inicioDatos]));
const seriales = new Set();
let filasValidas = 0;
let filasVacias = 0;
for (let i = inicioDatos; i < filas.length; i++) {
    const f = filas[i];
    if (typeof f[0] !== 'number')
        continue;
    seriales.add(Math.floor(f[0]));
    const entrada = f[3];
    const salida = f[4];
    if ((entrada === 0 || entrada === null) && (salida === 0 || salida === null)) {
        filasVacias++;
    }
    else {
        filasValidas++;
    }
}
const fechasOrdenadas = [...seriales].sort((a, b) => a - b);
console.log('rango de fechas:', fechaISO(fechasOrdenadas[0]), 'a', fechaISO(fechasOrdenadas[fechasOrdenadas.length - 1]));
console.log('fechas distintas:', fechasOrdenadas.map(fechaISO));
console.log('filas con horas:', filasValidas, '| filas vacias:', filasVacias);
//# sourceMappingURL=extraer-reporte-viejo-temp.js.map