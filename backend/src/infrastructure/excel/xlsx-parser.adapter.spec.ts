import * as XLSX from 'xlsx';
import { ImportacionFormatoInvalidoError } from '../../domain/errors/importacion-formato-invalido.error';
import { XlsxParserAdapter } from './xlsx-parser.adapter';

function libroDesdeFilas(encabezados: string[], filas: unknown[][]): Buffer {
  const hoja = XLSX.utils.aoa_to_sheet([encabezados, ...filas]);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Hoja1');
  return XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

/** Número de serie de Excel (fracción de día desde 1899-12-30) para una fecha
 *  UTC dada. Se usa en vez de `new Date(...)` como valor de celda: pasarle un
 *  `Date` a `aoa_to_sheet` lo convierte a serie usando componentes LOCALES
 *  (sensible a la zona horaria de quien corre el test), mientras que un
 *  número ya es exactamente lo que trae una celda de fecha real de Excel. */
function serialExcel(anio: number, mes: number, dia: number): number {
  const epocaExcelMs = Date.UTC(1899, 11, 30);
  return (Date.UTC(anio, mes - 1, dia) - epocaExcelMs) / 86400000;
}

describe('XlsxParserAdapter', () => {
  const parser = new XlsxParserAdapter();

  it('parsea fecha y hora como número de serie de Excel, y reconoce encabezados con tildes', () => {
    const buffer = libroDesdeFilas(
      ['Fecha', 'Código', 'Nombre', 'Entrada', 'Salida'],
      [[serialExcel(2026, 8, 5), 40, 'Juan Pérez', 0.354166667, 0.791666667]], // 08:30 y 19:00
    );

    const filas = parser.parsear(buffer);

    expect(filas).toHaveLength(1);
    expect(filas[0]).toMatchObject({
      linea: 2,
      codigo: 40,
      nombreCrudo: 'Juan Pérez',
      horaEntrada: '08:30',
      horaSalida: '19:00',
    });
    expect(filas[0].fecha?.toISOString().slice(0, 10)).toBe('2026-08-05');
  });

  it('reconoce encabezados con espacios, como "Hora Entrada" / "Hora Salida"', () => {
    const buffer = libroDesdeFilas(
      ['FECHA', 'Codigo', 'Nombre', 'Hora Entrada', 'Hora Salida'],
      [
        [
          serialExcel(2026, 6, 16),
          126,
          'Sergio Taveras',
          0.354166667, // 08:30
          0.729166667, // 17:30
        ],
      ],
    );

    const filas = parser.parsear(buffer);

    expect(filas).toHaveLength(1);
    expect(filas[0]).toMatchObject({
      codigo: 126,
      nombreCrudo: 'Sergio Taveras',
      horaEntrada: '08:30',
      horaSalida: '17:30',
    });
  });

  it('no introduce ningún desfase de horas sin importar la zona horaria del sistema', () => {
    // Regresión del bug real: una celda de hora leída con `cellDates: true`
    // podía quedar contaminada por la zona horaria del sistema para el
    // "día 0" ficticio de Excel. Se fija aquí con horas "raras" (no en punto)
    // para que cualquier desfase, por pequeño que sea, haga fallar el test.
    const buffer = libroDesdeFilas(
      ['fecha', 'codigo', 'entrada', 'salida'],
      [[serialExcel(2026, 6, 16), 4, 0.375694444, 0.905555556]], // 09:01 y 21:44
    );

    const filas = parser.parsear(buffer);

    expect(filas[0].horaEntrada).toBe('09:01');
    expect(filas[0].horaSalida).toBe('21:44');
  });

  it('parsea horas dadas como fracción de día (serial de Excel)', () => {
    const buffer = libroDesdeFilas(
      ['fecha', 'codigo', 'entrada', 'salida'],
      [[serialExcel(2026, 8, 5), 40, 0.375, 0.75]], // 09:00 y 18:00
    );

    const filas = parser.parsear(buffer);

    expect(filas[0].horaEntrada).toBe('09:00');
    expect(filas[0].horaSalida).toBe('18:00');
  });

  it('parsea fecha en formato DD/MM/YYYY', () => {
    const buffer = libroDesdeFilas(
      ['fecha', 'codigo', 'entrada', 'salida'],
      [['05/08/2026', 40, '08:30', '17:30']],
    );

    const filas = parser.parsear(buffer);

    expect(filas[0].fecha?.toISOString().slice(0, 10)).toBe('2026-08-05');
  });

  it('ignora filas completamente vacías (padding al final de la hoja)', () => {
    const buffer = libroDesdeFilas(
      ['fecha', 'codigo', 'entrada', 'salida'],
      [
        [serialExcel(2026, 8, 5), 40, '08:30', '17:30'],
        [null, null, null, null],
      ],
    );

    const filas = parser.parsear(buffer);

    expect(filas).toHaveLength(1);
  });

  it('numera las filas según su posición real en el Excel (linea = fila - 1 no aplica; header = 1)', () => {
    const buffer = libroDesdeFilas(
      ['fecha', 'codigo', 'entrada', 'salida'],
      [
        [serialExcel(2026, 8, 5), 40, '08:30', '17:30'],
        [serialExcel(2026, 8, 6), 41, '08:30', '17:30'],
      ],
    );

    const filas = parser.parsear(buffer);

    expect(filas[0].linea).toBe(2);
    expect(filas[1].linea).toBe(3);
  });

  it('deja en null la fecha/código/horas que no se pueden interpretar', () => {
    const buffer = libroDesdeFilas(
      ['fecha', 'codigo', 'entrada', 'salida'],
      [['no-es-fecha', 'no-es-numero', 'no-es-hora', '17:30']],
    );

    const filas = parser.parsear(buffer);

    expect(filas[0].fecha).toBeNull();
    expect(filas[0].codigo).toBeNull();
    expect(filas[0].horaEntrada).toBeNull();
    expect(filas[0].horaSalida).toBe('17:30');
  });

  it('lanza ImportacionFormatoInvalidoError si faltan columnas reconocibles', () => {
    const buffer = libroDesdeFilas(['columna1', 'columna2'], [['a', 'b']]);

    expect(() => parser.parsear(buffer)).toThrow(
      ImportacionFormatoInvalidoError,
    );
  });

  it('lanza ImportacionFormatoInvalidoError si el contenido no es un xlsx válido', () => {
    const buffer = Buffer.from('esto no es un excel');

    expect(() => parser.parsear(buffer)).toThrow(
      ImportacionFormatoInvalidoError,
    );
  });
});
