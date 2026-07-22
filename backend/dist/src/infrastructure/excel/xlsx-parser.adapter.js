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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.XlsxParserAdapter = void 0;
const common_1 = require("@nestjs/common");
const XLSX = __importStar(require("xlsx"));
const importacion_formato_invalido_error_1 = require("../../domain/errors/importacion-formato-invalido.error");
const ALIAS_FECHA = ['fecha', 'date'];
const ALIAS_CODIGO = ['codigo', 'cod', 'code'];
const ALIAS_NOMBRE = ['nombre', 'empleado', 'name'];
const ALIAS_ENTRADA = ['entrada', 'horaentrada', 'in'];
const ALIAS_SALIDA = ['salida', 'horasalida', 'out'];
const EPOCA_EXCEL_MS = Date.UTC(1899, 11, 30);
const MS_POR_DIA = 24 * 60 * 60 * 1000;
function normalizarEncabezado(valor) {
    return valor
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}
function encontrarColumna(encabezados, alias) {
    const encontrado = encabezados.find((encabezado) => alias.includes(normalizarEncabezado(encabezado)));
    return encontrado ?? null;
}
function formatearHora(horas, minutos) {
    const hh = String(((horas % 24) + 24) % 24).padStart(2, '0');
    const mm = String(minutos).padStart(2, '0');
    return `${hh}:${mm}`;
}
function parsearFecha(valor) {
    if (typeof valor === 'number' && Number.isFinite(valor)) {
        const dias = Math.floor(valor);
        return new Date(EPOCA_EXCEL_MS + dias * MS_POR_DIA);
    }
    if (typeof valor === 'string') {
        const texto = valor.trim();
        let match = /^(\d{4})-(\d{2})-(\d{2})/.exec(texto);
        if (match) {
            return new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
        }
        match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(texto);
        if (match) {
            return new Date(Date.UTC(+match[3], +match[2] - 1, +match[1]));
        }
    }
    return null;
}
function parsearHora(valor) {
    if (typeof valor === 'number' && Number.isFinite(valor)) {
        const fraccion = valor - Math.floor(valor);
        const minutosTotales = Math.round(fraccion * 24 * 60);
        return formatearHora(Math.floor(minutosTotales / 60), minutosTotales % 60);
    }
    if (typeof valor === 'string') {
        const match = /^([01]?\d|2[0-3]):([0-5]\d)/.exec(valor.trim());
        if (match) {
            return formatearHora(+match[1], +match[2]);
        }
    }
    return null;
}
function parsearTexto(valor) {
    if (typeof valor === 'string') {
        const texto = valor.trim();
        return texto !== '' ? texto : null;
    }
    if (typeof valor === 'number') {
        return String(valor);
    }
    return null;
}
function parsearCodigo(valor) {
    if (typeof valor === 'number' && Number.isInteger(valor)) {
        return valor;
    }
    if (typeof valor === 'string' && valor.trim() !== '') {
        const numero = Number(valor.trim());
        if (Number.isInteger(numero)) {
            return numero;
        }
    }
    return null;
}
let XlsxParserAdapter = class XlsxParserAdapter {
    parsear(contenido) {
        let libro;
        try {
            libro = XLSX.read(contenido, { type: 'buffer' });
        }
        catch {
            throw new importacion_formato_invalido_error_1.ImportacionFormatoInvalidoError('no se pudo leer el archivo como Excel (.xlsx).');
        }
        const primeraHoja = libro.SheetNames[0];
        const hoja = primeraHoja ? libro.Sheets[primeraHoja] : undefined;
        if (!hoja) {
            throw new importacion_formato_invalido_error_1.ImportacionFormatoInvalidoError('el archivo no contiene ninguna hoja.');
        }
        const filas = XLSX.utils.sheet_to_json(hoja, {
            defval: null,
        });
        if (filas.length === 0) {
            throw new importacion_formato_invalido_error_1.ImportacionFormatoInvalidoError('el archivo no tiene filas de datos.');
        }
        const encabezados = Object.keys(filas[0]);
        const colFecha = encontrarColumna(encabezados, ALIAS_FECHA);
        const colCodigo = encontrarColumna(encabezados, ALIAS_CODIGO);
        const colNombre = encontrarColumna(encabezados, ALIAS_NOMBRE);
        const colEntrada = encontrarColumna(encabezados, ALIAS_ENTRADA);
        const colSalida = encontrarColumna(encabezados, ALIAS_SALIDA);
        if (!colFecha || !colCodigo || !colEntrada || !colSalida) {
            throw new importacion_formato_invalido_error_1.ImportacionFormatoInvalidoError('no se reconocen las columnas esperadas (fecha, código, entrada, salida).');
        }
        const resultado = [];
        filas.forEach((fila, indice) => {
            const fecha = parsearFecha(fila[colFecha]);
            const codigo = parsearCodigo(fila[colCodigo]);
            const nombreCrudo = colNombre ? parsearTexto(fila[colNombre]) : null;
            const horaEntrada = parsearHora(fila[colEntrada]);
            const horaSalida = parsearHora(fila[colSalida]);
            const filaCompletamenteVacia = fecha === null &&
                codigo === null &&
                nombreCrudo === null &&
                horaEntrada === null &&
                horaSalida === null;
            if (filaCompletamenteVacia) {
                return;
            }
            resultado.push({
                linea: indice + 2,
                fecha,
                codigo,
                nombreCrudo,
                horaEntrada,
                horaSalida,
            });
        });
        return resultado;
    }
};
exports.XlsxParserAdapter = XlsxParserAdapter;
exports.XlsxParserAdapter = XlsxParserAdapter = __decorate([
    (0, common_1.Injectable)()
], XlsxParserAdapter);
//# sourceMappingURL=xlsx-parser.adapter.js.map