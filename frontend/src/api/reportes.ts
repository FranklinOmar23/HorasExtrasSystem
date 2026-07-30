import { apiClient } from './client';
import type { HistoricoPeriodo, ReporteEmpleado, ReportePeriodo } from '../types/api';

export async function obtenerReportePeriodo(periodoId: string): Promise<ReportePeriodo> {
  const { data } = await apiClient.get<ReportePeriodo>(`/periodos/${periodoId}/reporte`);
  return data;
}

export async function obtenerReporteEmpleado(
  periodoId: string,
  empleadoId: string,
): Promise<ReporteEmpleado> {
  const { data } = await apiClient.get<ReporteEmpleado>(
    `/periodos/${periodoId}/reporte/empleados/${empleadoId}`,
  );
  return data;
}

export interface ArchivoDescargado {
  blob: Blob;
  nombreArchivo: string;
}

function nombreDesdeContentDisposition(valor: string | undefined, fallback: string): string {
  const match = valor ? /filename="?([^";]+)"?/.exec(valor) : null;
  return match ? match[1] : fallback;
}

export async function descargarReporteExcel(
  periodoId: string,
  onProgreso?: (porcentaje: number | null) => void,
): Promise<ArchivoDescargado> {
  const response = await apiClient.get(`/periodos/${periodoId}/reporte/excel`, {
    responseType: 'blob',
    onDownloadProgress: onProgreso
      ? (e) => onProgreso(e.total ? Math.round((e.loaded / e.total) * 100) : null)
      : undefined,
  });
  return {
    blob: response.data,
    nombreArchivo: nombreDesdeContentDisposition(response.headers['content-disposition'], `reporte-${periodoId}.xlsx`),
  };
}

export async function descargarReporteEmpleadoExcel(
  periodoId: string,
  empleadoId: string,
  onProgreso?: (porcentaje: number | null) => void,
): Promise<ArchivoDescargado> {
  const response = await apiClient.get(`/periodos/${periodoId}/reporte/empleados/${empleadoId}/excel`, {
    responseType: 'blob',
    onDownloadProgress: onProgreso
      ? (e) => onProgreso(e.total ? Math.round((e.loaded / e.total) * 100) : null)
      : undefined,
  });
  return {
    blob: response.data,
    nombreArchivo: nombreDesdeContentDisposition(response.headers['content-disposition'], `reporte-${empleadoId}.xlsx`),
  };
}

export async function obtenerHistorico(meses = 6): Promise<HistoricoPeriodo[]> {
  const { data } = await apiClient.get<HistoricoPeriodo[]>('/reportes/historico', {
    params: { meses },
  });
  return data;
}
