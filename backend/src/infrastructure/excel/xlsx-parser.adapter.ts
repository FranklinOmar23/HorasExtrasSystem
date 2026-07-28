import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import {
  ExcelParserPort,
  FilaExcelCruda,
} from '../../application/ports/excel-parser.port';
import { ImportacionFormatoInvalidoError } from '../../domain/errors/importacion-formato-invalido.error';

const ALIAS_FECHA = ['fecha', 'date'];
const ALIAS_CODIGO = ['codigo', 'cod', 'code', 'id'];
const ALIAS_NOMBRE = ['nombre', 'empleado', 'name', 'fullname'];
const ALIAS_ENTRADA = ['entrada', 'horaentrada', 'in', 'clockin', 'clockintime'];
const ALIAS_SALIDA = ['salida', 'horasalida', 'out', 'clockout', 'clockouttime'];

/** Cuántas filas iniciales se revisan buscando el encabezado real, para
 *  saltar metadata como la del reporte "Time Card" (nombre de la empresa,
 *  título del reporte, fecha de exportación) antes de la fila de columnas. */
const MAX_FILAS_METADATA = 15;

/** Excel cuenta los días desde 1899-12-30 (incluye el "día 0" ficticio de 1900). */
const EPOCA_EXCEL_MS = Date.UTC(1899, 11, 30);
const MS_POR_DIA = 24 * 60 * 60 * 1000;

interface ColumnasDetectadas {
  fecha: number;
  codigo: number;
  nombre: number | null;
  entrada: number;
  salida: number;
}

/** Compacta un encabezado a minúsculas sin acentos ni espacios/guiones/etc.
 *  ("Hora Entrada", "hora_entrada", "Hora-Entrada", "Clock-In Time" →
 *  "horaentrada"/"clockintime") para que no dependamos de que el Excel use
 *  exactamente un separador u otro. */
function normalizarEncabezado(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Busca en una fila cruda las columnas reconocibles (fecha, código, entrada,
 * salida, nombre opcional). Cubre tanto el formato "simple" (fecha, código,
 * nombre, entrada, salida en la primera fila) como el de reportes tipo
 * "Time Card" (Full Name, ID, Date, Clock-In Time, Clock-Out Time, con
 * filas de metadata del reporte antes del encabezado real). Devuelve null
 * si la fila no tiene pinta de ser un encabezado válido.
 */
function detectarColumnas(filaCruda: unknown[]): ColumnasDetectadas | null {
  const normalizados = filaCruda.map((valor) =>
    typeof valor === 'string' ? normalizarEncabezado(valor) : '',
  );
  const indiceDe = (alias: string[]): number =>
    normalizados.findIndex((valor) => valor !== '' && alias.includes(valor));

  const fecha = indiceDe(ALIAS_FECHA);
  const codigo = indiceDe(ALIAS_CODIGO);
  const entrada = indiceDe(ALIAS_ENTRADA);
  const salida = indiceDe(ALIAS_SALIDA);
  if (fecha === -1 || codigo === -1 || entrada === -1 || salida === -1) {
    return null;
  }

  const nombreIndice = indiceDe(ALIAS_NOMBRE);
  return {
    fecha,
    codigo,
    nombre: nombreIndice === -1 ? null : nombreIndice,
    entrada,
    salida,
  };
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

/** Cualquier texto que no matchee "HH:mm" (incluido el "--" de "sin marcaje"
 *  de los reportes tipo Time Card) cae naturalmente a null. */
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

    // `header: 1` (filas como arrays, no objetos por clave) porque el
    // encabezado real no siempre es la primera fila: los reportes "Time
    // Card" traen 2-3 filas de metadata (empresa, título, fecha de
    // exportación) antes de la fila de columnas.
    const filasCrudas = XLSX.utils.sheet_to_json<unknown[]>(hoja, {
      header: 1,
      defval: null,
    });
    if (filasCrudas.length === 0) {
      throw new ImportacionFormatoInvalidoError(
        'el archivo no tiene filas de datos.',
      );
    }

    let indiceEncabezado = -1;
    let columnas: ColumnasDetectadas | null = null;
    for (
      let i = 0;
      i < Math.min(filasCrudas.length, MAX_FILAS_METADATA);
      i++
    ) {
      const detectadas = detectarColumnas(filasCrudas[i]);
      if (detectadas) {
        indiceEncabezado = i;
        columnas = detectadas;
        break;
      }
    }
    if (!columnas) {
      throw new ImportacionFormatoInvalidoError(
        'no se reconocen las columnas esperadas (fecha, código, entrada, salida).',
      );
    }

    const resultado: FilaExcelCruda[] = [];
    for (let i = indiceEncabezado + 1; i < filasCrudas.length; i++) {
      const fila = filasCrudas[i];
      const fecha = parsearFecha(fila[columnas.fecha]);
      const codigo = parsearCodigo(fila[columnas.codigo]);
      const nombreCrudo =
        columnas.nombre !== null ? parsearTexto(fila[columnas.nombre]) : null;
      const horaEntrada = parsearHora(fila[columnas.entrada]);
      const horaSalida = parsearHora(fila[columnas.salida]);

      const filaCompletamenteVacia =
        fecha === null &&
        codigo === null &&
        nombreCrudo === null &&
        horaEntrada === null &&
        horaSalida === null;
      if (filaCompletamenteVacia) {
        continue;
      }

      resultado.push({
        linea: i + 1,
        fecha,
        codigo,
        nombreCrudo,
        horaEntrada,
        horaSalida,
      });
    }

    return resultado;
  }
}
