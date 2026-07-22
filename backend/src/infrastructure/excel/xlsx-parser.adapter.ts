import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import {
  ExcelParserPort,
  FilaExcelCruda,
} from '../../application/ports/excel-parser.port';
import { ImportacionFormatoInvalidoError } from '../../domain/errors/importacion-formato-invalido.error';

const ALIAS_FECHA = ['fecha', 'date'];
const ALIAS_CODIGO = ['codigo', 'cod', 'code'];
const ALIAS_NOMBRE = ['nombre', 'empleado', 'name'];
const ALIAS_ENTRADA = ['entrada', 'horaentrada', 'in'];
const ALIAS_SALIDA = ['salida', 'horasalida', 'out'];

/** Excel cuenta los días desde 1899-12-30 (incluye el "día 0" ficticio de 1900). */
const EPOCA_EXCEL_MS = Date.UTC(1899, 11, 30);
const MS_POR_DIA = 24 * 60 * 60 * 1000;

/** Compacta un encabezado a minúsculas sin acentos ni espacios/guiones/etc.
 *  ("Hora Entrada", "hora_entrada", "Hora-Entrada" → "horaentrada") para que
 *  no dependamos de que el Excel use exactamente un separador u otro. */
function normalizarEncabezado(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function encontrarColumna(
  encabezados: string[],
  alias: string[],
): string | null {
  const encontrado = encabezados.find((encabezado) =>
    alias.includes(normalizarEncabezado(encabezado)),
  );
  return encontrado ?? null;
}

function formatearHora(horas: number, minutos: number): string {
  const hh = String(((horas % 24) + 24) % 24).padStart(2, '0');
  const mm = String(minutos).padStart(2, '0');
  return `${hh}:${mm}`;
}

/** Solo maneja number/string a propósito: como `XLSX.read` se llama sin
 *  `cellDates`, una celda de fecha/hora siempre llega como el número de
 *  serie crudo de Excel (fracción de día), nunca como `Date`. */
function parsearFecha(valor: unknown): Date | null {
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

function parsearHora(valor: unknown): string | null {
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

function parsearTexto(valor: unknown): string | null {
  if (typeof valor === 'string') {
    const texto = valor.trim();
    return texto !== '' ? texto : null;
  }
  if (typeof valor === 'number') {
    return String(valor);
  }
  return null;
}

function parsearCodigo(valor: unknown): number | null {
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

@Injectable()
export class XlsxParserAdapter implements ExcelParserPort {
  parsear(contenido: Buffer): FilaExcelCruda[] {
    let libro: XLSX.WorkBook;
    try {
      // Deliberadamente SIN `cellDates: true`: esa opción hace que SheetJS
      // convierta las celdas de fecha/hora a objetos `Date`, y esa conversión
      // puede quedar contaminada por la zona horaria del sistema para el
      // "día 0" ficticio de Excel (1899-12-30) — se detectó un desfase real
      // de horas al importar un archivo real. Se dejan los valores como el
      // número de serie crudo (fracción de día) y se parsean a mano con
      // aritmética pura (`parsearFecha`/`parsearHora`), que no depende de
      // ninguna zona horaria.
      libro = XLSX.read(contenido, { type: 'buffer' });
    } catch {
      throw new ImportacionFormatoInvalidoError(
        'no se pudo leer el archivo como Excel (.xlsx).',
      );
    }

    const primeraHoja = libro.SheetNames[0];
    const hoja = primeraHoja ? libro.Sheets[primeraHoja] : undefined;
    if (!hoja) {
      throw new ImportacionFormatoInvalidoError(
        'el archivo no contiene ninguna hoja.',
      );
    }

    const filas = XLSX.utils.sheet_to_json<Record<string, unknown>>(hoja, {
      defval: null,
    });
    if (filas.length === 0) {
      throw new ImportacionFormatoInvalidoError(
        'el archivo no tiene filas de datos.',
      );
    }

    const encabezados = Object.keys(filas[0]);
    const colFecha = encontrarColumna(encabezados, ALIAS_FECHA);
    const colCodigo = encontrarColumna(encabezados, ALIAS_CODIGO);
    const colNombre = encontrarColumna(encabezados, ALIAS_NOMBRE);
    const colEntrada = encontrarColumna(encabezados, ALIAS_ENTRADA);
    const colSalida = encontrarColumna(encabezados, ALIAS_SALIDA);

    if (!colFecha || !colCodigo || !colEntrada || !colSalida) {
      throw new ImportacionFormatoInvalidoError(
        'no se reconocen las columnas esperadas (fecha, código, entrada, salida).',
      );
    }

    const resultado: FilaExcelCruda[] = [];
    filas.forEach((fila, indice) => {
      const fecha = parsearFecha(fila[colFecha]);
      const codigo = parsearCodigo(fila[colCodigo]);
      const nombreCrudo = colNombre ? parsearTexto(fila[colNombre]) : null;
      const horaEntrada = parsearHora(fila[colEntrada]);
      const horaSalida = parsearHora(fila[colSalida]);

      const filaCompletamenteVacia =
        fecha === null &&
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
}
