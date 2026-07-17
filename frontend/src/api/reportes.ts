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

export async function descargarReporteExcel(periodoId: string): Promise<Blob> {
  const { data } = await apiClient.get(`/periodos/${periodoId}/reporte/excel`, {
    responseType: 'blob',
  });
  return data;
}

export async function obtenerHistorico(meses = 6): Promise<HistoricoPeriodo[]> {
  const { data } = await apiClient.get<HistoricoPeriodo[]>('/reportes/historico', {
    params: { meses },
  });
  return data;
}
