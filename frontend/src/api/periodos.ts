import { apiClient } from './client';
import type { Periodo } from '../types/api';

export interface CrearPeriodoInput {
  fechaInicio: string;
  fechaFin: string;
}

export async function listarPeriodos(): Promise<Periodo[]> {
  const { data } = await apiClient.get<Periodo[]>('/periodos');
  return data;
}

export async function obtenerPeriodo(id: string): Promise<Periodo> {
  const { data } = await apiClient.get<Periodo>(`/periodos/${id}`);
  return data;
}

export async function crearPeriodo(input: CrearPeriodoInput): Promise<Periodo> {
  const { data } = await apiClient.post<Periodo>('/periodos', input);
  return data;
}

export async function cerrarPeriodo(id: string): Promise<Periodo> {
  const { data } = await apiClient.post<Periodo>(`/periodos/${id}/cerrar`);
  return data;
}

export async function eliminarPeriodo(id: string): Promise<void> {
  await apiClient.delete(`/periodos/${id}`);
}

export async function listarPeriodosEliminados(): Promise<Periodo[]> {
  const { data } = await apiClient.get<Periodo[]>('/periodos/eliminados');
  return data;
}

export async function restaurarPeriodo(id: string): Promise<Periodo> {
  const { data } = await apiClient.post<Periodo>(`/periodos/${id}/restaurar`);
  return data;
}

export async function eliminarPeriodoPermanentemente(id: string): Promise<void> {
  await apiClient.delete(`/periodos/${id}/permanente`);
}
