import type { TipoHoraExtraCodigo } from '../types/api';

const formateadorMonto = new Intl.NumberFormat('es-DO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMonto(valor: string | number): string {
  const numero = typeof valor === 'string' ? Number(valor) : valor;
  return `RD$ ${formateadorMonto.format(Number.isFinite(numero) ? numero : 0)}`;
}

export function formatNumero(valor: string | number): string {
  const numero = typeof valor === 'string' ? Number(valor) : valor;
  return formateadorMonto.format(Number.isFinite(numero) ? numero : 0);
}

const MESES_CORTOS = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];
const MESES_LARGOS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

function partesFecha(iso: string): { dia: number; mes: number; anio: number } {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return { dia, mes: mes - 1, anio };
}

export function formatFechaCorta(iso: string): string {
  const { dia, mes } = partesFecha(iso);
  return `${String(dia).padStart(2, '0')} ${MESES_CORTOS[mes]}`;
}

export function formatFechaDia(iso: string): string {
  const { dia, mes, anio } = partesFecha(iso);
  return `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}/${anio}`;
}

export function formatRangoPeriodo(fechaInicio: string, fechaFin: string): string {
  const inicio = partesFecha(fechaInicio);
  const fin = partesFecha(fechaFin);
  if (inicio.mes === fin.mes && inicio.anio === fin.anio) {
    return `${inicio.dia}–${fin.dia} ${MESES_LARGOS[fin.mes]} ${fin.anio}`;
  }
  return `${inicio.dia} ${MESES_CORTOS[inicio.mes]} – ${fin.dia} ${MESES_CORTOS[fin.mes]} ${fin.anio}`;
}

export interface EtiquetaTipoHora {
  texto: string;
  tono: 'sea' | 'sun' | 'coral' | 'neutral';
}

const ETIQUETAS_TIPO_HORA: Record<TipoHoraExtraCodigo, EtiquetaTipoHora> = {
  HE_35: { texto: 'Extra 35%', tono: 'sea' },
  HE_100: { texto: 'Extra 100%', tono: 'coral' },
  NOCTURNA_15: { texto: 'Nocturna 15%', tono: 'sun' },
  FERIADO: { texto: 'Feriado', tono: 'coral' },
};

export function etiquetaTipoHora(codigo: TipoHoraExtraCodigo): EtiquetaTipoHora {
  return ETIQUETAS_TIPO_HORA[codigo];
}
