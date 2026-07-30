import ExcelJS from 'exceljs';
import { ReportePeriodo } from '../../application/services/reporte-periodo.service';
import { ReporteEmpleadoPeriodo } from '../../application/use-cases/reportes/obtener-reporte-empleado.use-case';
import { RegistroConCalculos } from '../../application/ports/registro-horas.repository.port';
import { TipoHoraExtraCodigo } from '../../domain/enums/tipo-hora-extra-codigo.enum';

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const MARCA = '0E7A6F'; // sea-600, color de marca de Hartemanía
const MARCA_OSCURO = '07433D'; // sea-800
const GRIS_BANDA = 'F5F3ED'; // paper-2
const GRIS_BORDE = 'E4E0D6'; // line

const ETIQUETA_TIPO: Record<TipoHoraExtraCodigo, string> = {
  [TipoHoraExtraCodigo.HE_35]: 'Extra 35%',
  [TipoHoraExtraCodigo.HE_100]: 'Extra 100%',
  [TipoHoraExtraCodigo.NOCTURNA_15]: 'Nocturna 15%',
  [TipoHoraExtraCodigo.FERIADO]: 'Feriado',
};

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

function tituloPeriodo(fechaInicio: Date, fechaFin: Date, estado: string): { titulo: string; subtitulo: string } {
  return {
    titulo: `${rangoLegible(fechaInicio, fechaFin)} — Horas Extras Hartemanía`,
    subtitulo: `${estado === 'CERRADO' ? 'Periodo cerrado' : 'Periodo abierto'} · Generado el ${new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'long', year: 'numeric' })}`,
  };
}

function agregarEncabezado(
  hoja: ExcelJS.Worksheet,
  titulo: string,
  subtitulo: string,
  totalColumnas: number,
): void {
  hoja.mergeCells(1, 1, 1, totalColumnas);
  const celdaTitulo = hoja.getCell(1, 1);
  celdaTitulo.value = titulo;
  celdaTitulo.font = { name: 'Calibri', size: 14, bold: true, color: { argb: `FF${MARCA_OSCURO}` } };
  celdaTitulo.alignment = { vertical: 'middle' };
  hoja.getRow(1).height = 28;

  hoja.mergeCells(2, 1, 2, totalColumnas);
  const celdaSubtitulo = hoja.getCell(2, 1);
  celdaSubtitulo.value = subtitulo;
  celdaSubtitulo.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF6B6A61' } };
  hoja.getRow(2).height = 18;

  hoja.getRow(3).height = 6;
}

function agregarFilaEncabezadoTabla(
  hoja: ExcelJS.Worksheet,
  fila: number,
  columnas: { encabezado: string }[],
): void {
  const filaEncabezado = hoja.getRow(fila);
  columnas.forEach((c, i) => {
    const celda = filaEncabezado.getCell(i + 1);
    celda.value = c.encabezado;
    celda.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FFFFFFFF' } };
    celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${MARCA}` } };
    celda.alignment = { vertical: 'middle', horizontal: i <= 1 ? 'left' : 'right', wrapText: true };
    celda.border = { bottom: { style: 'thin', color: { argb: `FF${MARCA_OSCURO}` } } };
  });
  filaEncabezado.height = 30;
}

/** Nombre de archivo sugerido: Reporte-Cuadre-<inicio>_<fin>.xlsx (fechas ISO, seguro para sistema de archivos). */
export function nombreArchivoReporteExcel(reporte: ReportePeriodo): string {
  return `Reporte-Cuadre-${aFechaISO(reporte.periodo.fechaInicio)}_${aFechaISO(reporte.periodo.fechaFin)}.xlsx`;
}

export function nombreArchivoReporteEmpleadoExcel(reporte: ReporteEmpleadoPeriodo): string {
  return `Reporte-${reporte.fila.empleado.codigo}-${reporte.fila.empleado.nombre.replace(/\s+/g, '-')}-${aFechaISO(reporte.periodo.fechaInicio)}_${aFechaISO(reporte.periodo.fechaFin)}.xlsx`;
}

const COLUMNAS_CUADRE: { encabezado: string; ancho: number; formato?: string }[] = [
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

function agregarHojaCuadre(libro: ExcelJS.Workbook, reporte: ReportePeriodo): void {
  const totalColumnas = COLUMNAS_CUADRE.length;
  const hoja = libro.addWorksheet('Resumen', {
    views: [{ state: 'frozen', ySplit: 4 }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
  });
  hoja.columns = COLUMNAS_CUADRE.map((c) => ({ width: c.ancho }));

  const { titulo, subtitulo } = tituloPeriodo(reporte.periodo.fechaInicio, reporte.periodo.fechaFin, reporte.periodo.estado);
  agregarEncabezado(hoja, `Cuadre de periodo — ${titulo}`, subtitulo, totalColumnas);
  agregarFilaEncabezadoTabla(hoja, 4, COLUMNAS_CUADRE);

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
      if (COLUMNAS_CUADRE[i].formato) celda.numFmt = COLUMNAS_CUADRE[i].formato!;
      celda.alignment = { horizontal: i <= 1 ? 'left' : 'right' };
      celda.font = i === totalColumnas - 1 ? { bold: true, color: { argb: `FF${MARCA_OSCURO}` } } : { color: { argb: 'FF08171B' } };
      if (indice % 2 === 1) {
        celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${GRIS_BANDA}` } };
      }
      celda.border = { bottom: { style: 'hair', color: { argb: `FF${GRIS_BORDE}` } } };
    });
  });

  const filaTotalIdx = 5 + reporte.filas.length + 1;
  hoja.mergeCells(filaTotalIdx, 1, filaTotalIdx, totalColumnas - 1);
  const celdaEtiquetaTotal = hoja.getCell(filaTotalIdx, 1);
  celdaEtiquetaTotal.value = `GRAN TOTAL · ${reporte.filas.length} empleado${reporte.filas.length === 1 ? '' : 's'}`;
  celdaEtiquetaTotal.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
  celdaEtiquetaTotal.alignment = { vertical: 'middle', horizontal: 'right' };
  celdaEtiquetaTotal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${MARCA_OSCURO}` } };

  const celdaTotal = hoja.getCell(filaTotalIdx, totalColumnas);
  celdaTotal.value = reporte.granTotal.toNumber();
  celdaTotal.numFmt = '#,##0.00';
  celdaTotal.font = { bold: true, size: 13, color: { argb: 'FFFFC468' } };
  celdaTotal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${MARCA_OSCURO}` } };
  celdaTotal.alignment = { horizontal: 'right', vertical: 'middle' };
  hoja.getRow(filaTotalIdx).height = 26;
}

const COLUMNAS_DETALLE_GLOBAL: { encabezado: string; ancho: number; formato?: string }[] = [
  { encabezado: 'Fecha', ancho: 12 },
  { encabezado: 'Código', ancho: 10 },
  { encabezado: 'Empleado', ancho: 30 },
  { encabezado: 'Entrada', ancho: 10 },
  { encabezado: 'Salida', ancho: 10 },
  { encabezado: 'Tipo', ancho: 16 },
  { encabezado: 'Horas', ancho: 10, formato: '#,##0.00' },
  { encabezado: 'Valor (RD$)', ancho: 14, formato: '#,##0.00' },
];

interface FilaDetalleGlobal {
  fecha: Date;
  codigo: number;
  nombre: string;
  horaEntrada: string;
  horaSalida: string;
  tipo: string;
  horas: number;
  monto: number;
}

function filasDetalleDesdeRegistros(
  registros: RegistroConCalculos[],
  empleadoPorId: Map<string, { codigo: number; nombre: string }>,
): FilaDetalleGlobal[] {
  const filas: FilaDetalleGlobal[] = [];
  for (const { registro, calculos } of registros) {
    const empleado = empleadoPorId.get(registro.empleadoId);
    if (!empleado) continue;
    if (calculos.length === 0) {
      filas.push({
        fecha: registro.fecha,
        codigo: empleado.codigo,
        nombre: empleado.nombre,
        horaEntrada: registro.horaEntrada,
        horaSalida: registro.horaSalida,
        tipo: 'Normal',
        horas: 0,
        monto: 0,
      });
      continue;
    }
    for (const calculo of calculos) {
      filas.push({
        fecha: registro.fecha,
        codigo: empleado.codigo,
        nombre: empleado.nombre,
        horaEntrada: registro.horaEntrada,
        horaSalida: registro.horaSalida,
        tipo: ETIQUETA_TIPO[calculo.tipoHoraCodigo],
        horas: calculo.cantidadHoras.toNumber(),
        monto: calculo.monto.toNumber(),
      });
    }
  }
  filas.sort((a, b) => a.codigo - b.codigo || a.fecha.getTime() - b.fecha.getTime());
  return filas;
}

function agregarHojaDetalleGlobal(libro: ExcelJS.Workbook, reporte: ReportePeriodo): void {
  const totalColumnas = COLUMNAS_DETALLE_GLOBAL.length;
  const hoja = libro.addWorksheet('Detalle día por día', {
    views: [{ state: 'frozen', ySplit: 4 }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
  });
  hoja.columns = COLUMNAS_DETALLE_GLOBAL.map((c) => ({ width: c.ancho }));

  const { titulo, subtitulo } = tituloPeriodo(reporte.periodo.fechaInicio, reporte.periodo.fechaFin, reporte.periodo.estado);
  agregarEncabezado(hoja, `Detalle día por día — ${titulo}`, subtitulo, totalColumnas);
  agregarFilaEncabezadoTabla(hoja, 4, COLUMNAS_DETALLE_GLOBAL);

  const empleadoPorId = new Map(reporte.filas.map((f) => [f.empleado.id, { codigo: f.empleado.codigo, nombre: f.empleado.nombre }]));
  const filas = filasDetalleDesdeRegistros(reporte.registros, empleadoPorId);

  filas.forEach((fila, indice) => {
    const numeroFila = 5 + indice;
    const valores = [
      aFechaISO(fila.fecha),
      fila.codigo,
      fila.nombre,
      fila.horaEntrada,
      fila.horaSalida,
      fila.tipo,
      fila.horas,
      fila.monto,
    ];
    const filaExcel = hoja.getRow(numeroFila);
    valores.forEach((valor, i) => {
      const celda = filaExcel.getCell(i + 1);
      celda.value = valor;
      if (COLUMNAS_DETALLE_GLOBAL[i].formato) celda.numFmt = COLUMNAS_DETALLE_GLOBAL[i].formato!;
      celda.alignment = { horizontal: i <= 2 ? 'left' : 'right' };
      celda.font = { color: { argb: 'FF08171B' } };
      if (indice % 2 === 1) {
        celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${GRIS_BANDA}` } };
      }
      celda.border = { bottom: { style: 'hair', color: { argb: `FF${GRIS_BORDE}` } } };
    });
  });
}

export async function construirReporteExcel(reporte: ReportePeriodo): Promise<Buffer> {
  const libro = new ExcelJS.Workbook();
  libro.creator = 'Sistema de Horas Extras — Hartemanía';
  libro.created = new Date();

  agregarHojaCuadre(libro, reporte);
  agregarHojaDetalleGlobal(libro, reporte);

  const buffer = await libro.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

const COLUMNAS_RESUMEN_EMPLEADO: { encabezado: string; ancho: number; formato?: string }[] = [
  { encabezado: 'Concepto', ancho: 26 },
  { encabezado: 'Horas', ancho: 12, formato: '#,##0.00' },
  { encabezado: 'Valor (RD$)', ancho: 16, formato: '#,##0.00' },
];

function agregarHojaResumenEmpleado(libro: ExcelJS.Workbook, reporte: ReporteEmpleadoPeriodo): void {
  const totalColumnas = COLUMNAS_RESUMEN_EMPLEADO.length;
  const hoja = libro.addWorksheet('Resumen', {
    pageSetup: { orientation: 'portrait', fitToPage: true, fitToWidth: 1 },
  });
  hoja.columns = COLUMNAS_RESUMEN_EMPLEADO.map((c) => ({ width: c.ancho }));

  const { titulo, subtitulo } = tituloPeriodo(reporte.periodo.fechaInicio, reporte.periodo.fechaFin, reporte.periodo.estado);
  agregarEncabezado(
    hoja,
    `${reporte.fila.empleado.codigo} · ${reporte.fila.empleado.nombre} — ${titulo}`,
    subtitulo,
    totalColumnas,
  );
  agregarFilaEncabezadoTabla(hoja, 4, COLUMNAS_RESUMEN_EMPLEADO);

  const filas = reporte.fila;
  const conceptos: { concepto: string; horas: number; monto: number }[] = [
    { concepto: 'Salario/hora', horas: 0, monto: filas.salarioHora.toNumber() },
    { concepto: ETIQUETA_TIPO[TipoHoraExtraCodigo.HE_35], horas: filas.horas.he35.toNumber(), monto: filas.montos.he35.toNumber() },
    { concepto: ETIQUETA_TIPO[TipoHoraExtraCodigo.HE_100], horas: filas.horas.he100.toNumber(), monto: filas.montos.he100.toNumber() },
    { concepto: ETIQUETA_TIPO[TipoHoraExtraCodigo.NOCTURNA_15], horas: filas.horas.nocturna.toNumber(), monto: filas.montos.nocturna.toNumber() },
    { concepto: ETIQUETA_TIPO[TipoHoraExtraCodigo.FERIADO], horas: filas.horas.feriado.toNumber(), monto: filas.montos.feriado.toNumber() },
  ];

  conceptos.forEach((c, indice) => {
    const numeroFila = 5 + indice;
    const filaExcel = hoja.getRow(numeroFila);
    filaExcel.getCell(1).value = c.concepto;
    filaExcel.getCell(2).value = c.concepto === 'Salario/hora' ? null : c.horas;
    filaExcel.getCell(3).value = c.monto;
    filaExcel.getCell(2).numFmt = '#,##0.00';
    filaExcel.getCell(3).numFmt = '#,##0.00';
    filaExcel.getCell(1).alignment = { horizontal: 'left' };
    filaExcel.getCell(2).alignment = { horizontal: 'right' };
    filaExcel.getCell(3).alignment = { horizontal: 'right' };
    if (indice % 2 === 1) {
      for (let col = 1; col <= totalColumnas; col++) {
        filaExcel.getCell(col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${GRIS_BANDA}` } };
      }
    }
  });

  if (filas.retroactivo.dias > 0) {
    const numeroFila = 5 + conceptos.length;
    const filaExcel = hoja.getRow(numeroFila);
    filaExcel.getCell(1).value = `Incluye retroactivo (${filas.retroactivo.dias} día${filas.retroactivo.dias === 1 ? '' : 's'})`;
    filaExcel.getCell(1).font = { italic: true, color: { argb: 'FF6B6A61' } };
    filaExcel.getCell(3).value = filas.retroactivo.monto.toNumber();
    filaExcel.getCell(3).numFmt = '#,##0.00';
    filaExcel.getCell(3).font = { italic: true, color: { argb: 'FF6B6A61' } };
    filaExcel.getCell(3).alignment = { horizontal: 'right' };
  }

  const filaTotalIdx = 5 + conceptos.length + (filas.retroactivo.dias > 0 ? 1 : 0) + 1;
  hoja.mergeCells(filaTotalIdx, 1, filaTotalIdx, totalColumnas - 1);
  const celdaEtiquetaTotal = hoja.getCell(filaTotalIdx, 1);
  celdaEtiquetaTotal.value = 'TOTAL A PAGAR';
  celdaEtiquetaTotal.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
  celdaEtiquetaTotal.alignment = { vertical: 'middle', horizontal: 'right' };
  celdaEtiquetaTotal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${MARCA_OSCURO}` } };

  const celdaTotal = hoja.getCell(filaTotalIdx, totalColumnas);
  celdaTotal.value = filas.total.toNumber();
  celdaTotal.numFmt = '#,##0.00';
  celdaTotal.font = { bold: true, size: 13, color: { argb: 'FFFFC468' } };
  celdaTotal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${MARCA_OSCURO}` } };
  celdaTotal.alignment = { horizontal: 'right', vertical: 'middle' };
  hoja.getRow(filaTotalIdx).height = 26;
}

const COLUMNAS_DETALLE_EMPLEADO: { encabezado: string; ancho: number; formato?: string }[] = [
  { encabezado: 'Fecha', ancho: 12 },
  { encabezado: 'Entrada', ancho: 10 },
  { encabezado: 'Salida', ancho: 10 },
  { encabezado: 'Turno', ancho: 14 },
  { encabezado: 'Tipo', ancho: 16 },
  { encabezado: 'Horas', ancho: 10, formato: '#,##0.00' },
  { encabezado: 'Valor (RD$)', ancho: 14, formato: '#,##0.00' },
];

function agregarHojaDetalleEmpleado(libro: ExcelJS.Workbook, reporte: ReporteEmpleadoPeriodo): void {
  const totalColumnas = COLUMNAS_DETALLE_EMPLEADO.length;
  const hoja = libro.addWorksheet('Detalle día por día', {
    views: [{ state: 'frozen', ySplit: 4 }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
  });
  hoja.columns = COLUMNAS_DETALLE_EMPLEADO.map((c) => ({ width: c.ancho }));

  const { titulo, subtitulo } = tituloPeriodo(reporte.periodo.fechaInicio, reporte.periodo.fechaFin, reporte.periodo.estado);
  agregarEncabezado(
    hoja,
    `${reporte.fila.empleado.codigo} · ${reporte.fila.empleado.nombre} — ${titulo}`,
    subtitulo,
    totalColumnas,
  );
  agregarFilaEncabezadoTabla(hoja, 4, COLUMNAS_DETALLE_EMPLEADO);

  const registrosOrdenados = [...reporte.registros].sort((a, b) => a.registro.fecha.getTime() - b.registro.fecha.getTime());

  let numeroFila = 5;
  for (const { registro, calculos, turno } of registrosOrdenados) {
    const filasCalculo = calculos.length > 0 ? calculos : [null];
    for (const calculo of filasCalculo) {
      const valores = [
        aFechaISO(registro.fecha),
        registro.horaEntrada,
        registro.horaSalida,
        turno.nombre,
        calculo ? ETIQUETA_TIPO[calculo.tipoHoraCodigo] : 'Normal',
        calculo ? calculo.cantidadHoras.toNumber() : 0,
        calculo ? calculo.monto.toNumber() : 0,
      ];
      const filaExcel = hoja.getRow(numeroFila);
      valores.forEach((valor, i) => {
        const celda = filaExcel.getCell(i + 1);
        celda.value = valor;
        if (COLUMNAS_DETALLE_EMPLEADO[i].formato) celda.numFmt = COLUMNAS_DETALLE_EMPLEADO[i].formato!;
        celda.alignment = { horizontal: i <= 3 ? 'left' : 'right' };
        celda.font = { color: { argb: 'FF08171B' } };
        if ((numeroFila - 5) % 2 === 1) {
          celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${GRIS_BANDA}` } };
        }
        celda.border = { bottom: { style: 'hair', color: { argb: `FF${GRIS_BORDE}` } } };
      });
      numeroFila += 1;
    }
  }
}

export async function construirReporteEmpleadoExcel(reporte: ReporteEmpleadoPeriodo): Promise<Buffer> {
  const libro = new ExcelJS.Workbook();
  libro.creator = 'Sistema de Horas Extras — Hartemanía';
  libro.created = new Date();

  agregarHojaResumenEmpleado(libro, reporte);
  agregarHojaDetalleEmpleado(libro, reporte);

  const buffer = await libro.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
