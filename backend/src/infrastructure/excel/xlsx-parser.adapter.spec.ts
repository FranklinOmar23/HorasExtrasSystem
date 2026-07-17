import * as XLSX from 'xlsx';
import { ImportacionFormatoInvalidoError } from '../../domain/errors/importacion-formato-invalido.error';
import { XlsxParserAdapter } from './xlsx-parser.adapter';

function libroDesdeFilas(encabezados: string[], filas: unknown[][]): Buffer {
  const hoja = XLSX.utils.aoa_to_sheet([encabezados, ...filas]);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Hoja1');
  return XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

describe('XlsxParserAdapter', () => {
  const parser = new XlsxParserAdapter();

  it('parsea fecha (Date), horas de texto y reconoce encabezados con tildes', () => {
    const buffer = libroDesdeFilas(
      ['Fecha', 'Código', 'Nombre', 'Entrada', 'Salida'],
      [[new Date(Date.UTC(2026, 7, 5)), 40, 'Juan Pérez', '08:30', '19:00']],
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

  it('parsea horas dadas como fracción de día (serial de Excel)', () => {
    const buffer = libroDesdeFilas(
      ['fecha', 'codigo', 'entrada', 'salida'],
      [[new Date(Date.UTC(2026, 7, 5)), 40, 0.375, 0.75]], // 09:00 y 18:00
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
        [new Date(Date.UTC(2026, 7, 5)), 40, '08:30', '17:30'],
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
        [new Date(Date.UTC(2026, 7, 5)), 40, '08:30', '17:30'],
        [new Date(Date.UTC(2026, 7, 6)), 41, '08:30', '17:30'],
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
