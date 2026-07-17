import * as XLSX from 'xlsx';
import { ReportePeriodo } from '../../application/services/reporte-periodo.service';

function aFechaISO(fecha: Date): string {
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

export function construirReporteExcel(reporte: ReportePeriodo): Buffer {
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
  return XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}
