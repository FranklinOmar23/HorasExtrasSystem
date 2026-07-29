import ExcelJS from 'exceljs';
import { ReportePeriodo } from '../../application/services/reporte-periodo.service';

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const MARCA = '0E7A6F'; // sea-600, color de marca de Hartemanía
const MARCA_OSCURO = '07433D'; // sea-800
const GRIS_BANDA = 'F5F3ED'; // paper-2
const GRIS_BORDE = 'E4E0D6'; // line

function aFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

/** "16 al 30 de junio de 2026" / "28 de junio al 3 de julio de 2026" si cruza de mes. */
function rangoLegible(inicio: Date, fin: Date): string {
  const di = inicio.getUTCDate();
  const mi = inicio.getUTCMonth();
  const ai = inicio.getUTCFullYear();
  const df = fin.getUTCDate();
  const mf = fin.getUTCMonth();
  const af = fin.getUTCFullYear();

  if (mi === mf && ai === af) {
    return `${di} al ${df} de ${MESES[mf]} de ${af}`;
  }
  if (ai === af) {
    return `${di} de ${MESES[mi]} al ${df} de ${MESES[mf]} de ${af}`;
  }
  return `${di} de ${MESES[mi]} de ${ai} al ${df} de ${MESES[mf]} de ${af}`;
}

/** Nombre de archivo sugerido: Reporte-Cuadre-<inicio>_<fin>.xlsx (fechas ISO, seguro para sistema de archivos). */
export function nombreArchivoReporteExcel(reporte: ReportePeriodo): string {
  return `Reporte-Cuadre-${aFechaISO(reporte.periodo.fechaInicio)}_${aFechaISO(reporte.periodo.fechaFin)}.xlsx`;
}

const COLUMNAS: { encabezado: string; ancho: number; formato?: string }[] = [
  { encabezado: 'Código', ancho: 10 },
  { encabezado: 'Nombre', ancho: 32 },
  { encabezado: 'Salario/hora', ancho: 14, formato: '#,##0.00' },
  { encabezado: 'HE 35% (h)', ancho: 12, formato: '#,##0.00' },
  { encabezado: 'HE 35% (RD$)', ancho: 14, formato: '#,##0.00' },
  { encabezado: 'HE 100% (h)', ancho: 12, formato: '#,##0.00' },
  { encabezado: 'HE 100% (RD$)', ancho: 14, formato: '#,##0.00' },
  { encabezado: 'Nocturna 15% (h)', ancho: 15, formato: '#,##0.00' },
  { encabezado: 'Nocturna 15% (RD$)', ancho: 16, formato: '#,##0.00' },
  { encabezado: 'Feriado (h)', ancho: 12, formato: '#,##0.00' },
  { encabezado: 'Feriado (RD$)', ancho: 14, formato: '#,##0.00' },
  { encabezado: 'Retroactivo (RD$)', ancho: 16, formato: '#,##0.00' },
  { encabezado: 'Total (RD$)', ancho: 16, formato: '#,##0.00' },
];
const TOTAL_COLUMNAS = COLUMNAS.length;

export async function construirReporteExcel(
  reporte: ReportePeriodo,
): Promise<Buffer> {
  const libro = new ExcelJS.Workbook();
  libro.creator = 'Sistema de Horas Extras — Hartemanía';
  libro.created = new Date();

  const hoja = libro.addWorksheet('Cuadre', {
    views: [{ state: 'frozen', ySplit: 4 }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
  });
  hoja.columns = COLUMNAS.map((c) => ({ width: c.ancho }));

  // --- Título ---
  hoja.mergeCells(1, 1, 1, TOTAL_COLUMNAS);
  const celdaTitulo = hoja.getCell(1, 1);
  celdaTitulo.value = `Cuadre de periodo — ${rangoLegible(reporte.periodo.fechaInicio, reporte.periodo.fechaFin)} — Horas Extras Hartemanía`;
  celdaTitulo.font = { name: 'Calibri', size: 14, bold: true, color: { argb: `FF${MARCA_OSCURO}` } };
  celdaTitulo.alignment = { vertical: 'middle' };
  hoja.getRow(1).height = 28;

  // --- Subtítulo: estado del periodo + fecha de generación ---
  hoja.mergeCells(2, 1, 2, TOTAL_COLUMNAS);
  const celdaSubtitulo = hoja.getCell(2, 1);
  const estado = reporte.periodo.estado === 'CERRADO' ? 'Periodo cerrado' : 'Periodo abierto';
  celdaSubtitulo.value = `${estado} · Generado el ${new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'long', year: 'numeric' })}`;
  celdaSubtitulo.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF6B6A61' } };
  hoja.getRow(2).height = 18;

  // --- Fila 3 en blanco (aire antes del encabezado) ---
  hoja.getRow(3).height = 6;

  // --- Encabezados (fila 4) ---
  const filaEncabezado = hoja.getRow(4);
  COLUMNAS.forEach((c, i) => {
    const celda = filaEncabezado.getCell(i + 1);
    celda.value = c.encabezado;
    celda.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FFFFFFFF' } };
    celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${MARCA}` } };
    celda.alignment = { vertical: 'middle', horizontal: i <= 1 ? 'left' : 'right', wrapText: true };
    celda.border = { bottom: { style: 'thin', color: { argb: `FF${MARCA_OSCURO}` } } };
  });
  filaEncabezado.height = 30;

  // --- Filas de datos ---
  reporte.filas.forEach((fila, indice) => {
    const numeroFila = 5 + indice;
    const valores = [
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
      fila.retroactivo.monto.toNumber(),
      fila.total.toNumber(),
    ];
    const filaExcel = hoja.getRow(numeroFila);
    valores.forEach((valor, i) => {
      const celda = filaExcel.getCell(i + 1);
      celda.value = valor;
      if (COLUMNAS[i].formato) celda.numFmt = COLUMNAS[i].formato!;
      celda.alignment = { horizontal: i <= 1 ? 'left' : 'right' };
      celda.font = i === TOTAL_COLUMNAS - 1 ? { bold: true, color: { argb: `FF${MARCA_OSCURO}` } } : { color: { argb: 'FF08171B' } };
      if (indice % 2 === 1) {
        celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${GRIS_BANDA}` } };
      }
      celda.border = { bottom: { style: 'hair', color: { argb: `FF${GRIS_BORDE}` } } };
    });
  });

  // --- Gran total ---
  const filaTotalIdx = 5 + reporte.filas.length + 1;
  hoja.mergeCells(filaTotalIdx, 1, filaTotalIdx, TOTAL_COLUMNAS - 1);
  const celdaEtiquetaTotal = hoja.getCell(filaTotalIdx, 1);
  celdaEtiquetaTotal.value = `GRAN TOTAL · ${reporte.filas.length} empleado${reporte.filas.length === 1 ? '' : 's'}`;
  celdaEtiquetaTotal.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
  celdaEtiquetaTotal.alignment = { vertical: 'middle', horizontal: 'right' };
  celdaEtiquetaTotal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${MARCA_OSCURO}` } };

  const celdaTotal = hoja.getCell(filaTotalIdx, TOTAL_COLUMNAS);
  celdaTotal.value = reporte.granTotal.toNumber();
  celdaTotal.numFmt = '#,##0.00';
  celdaTotal.font = { bold: true, size: 13, color: { argb: 'FFFFC468' } };
  celdaTotal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${MARCA_OSCURO}` } };
  celdaTotal.alignment = { horizontal: 'right', vertical: 'middle' };
  hoja.getRow(filaTotalIdx).height = 26;

  const buffer = await libro.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
