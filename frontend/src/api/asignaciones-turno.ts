import { apiClient } from './client';
import type { AsignacionTurno } from '../types/api';

export interface CrearAsignacionTurnoInput {
  empleadoId: string;
  turnoId: string;
  fechaDesde: string;
  fechaHasta?: string;
  comentario?: string;
}

export interface ActualizarAsignacionTurnoInput {
  turnoId?: string;
  fechaDesde?: string;
  fechaHasta?: string | null;
  comentario?: string | null;
}

export async function listarAsignacionesPorEmpleado(empleadoId: string): Promise<AsignacionTurno[]> {
  const { data } = await apiClient.get<AsignacionTurno[]>(`/empleados/${empleadoId}/asignaciones-turno`);
  return data;
}

export async function crearAsignacionTurno(input: CrearAsignacionTurnoInput): Promise<AsignacionTurno> {
  const { data } = await apiClient.post<AsignacionTurno>('/asignaciones-turno', input);
  return data;
}

export async function actualizarAsignacionTurno(
  id: string,
  input: ActualizarAsignacionTurnoInput,
): Promise<AsignacionTurno> {
  const { data } = await apiClient.patch<AsignacionTurno>(`/asignaciones-turno/${id}`, input);
  return data;
}

export async function eliminarAsignacionTurno(id: string): Promise<void> {
  await apiClient.delete(`/asignaciones-turno/${id}`);
}
