import { apiClient } from './client';
import type { Configuracion, Feriado, TipoHoraExtra } from '../types/api';

export async function obtenerConfiguracion(): Promise<Configuracion> {
  const { data } = await apiClient.get<Configuracion>('/configuracion');
  return data;
}

export async function actualizarConfiguracion(cambios: Partial<Configuracion>): Promise<Configuracion> {
  const { data } = await apiClient.patch<Configuracion>('/configuracion', cambios);
  return data;
}

export async function listarTiposHoraExtra(): Promise<TipoHoraExtra[]> {
  const { data } = await apiClient.get<TipoHoraExtra[]>('/tipos-hora-extra');
  return data;
}

export interface ActualizarTipoHoraExtraInput {
  nombre?: string;
  porcentaje?: string;
  activo?: boolean;
}

export async function actualizarTipoHoraExtra(
  id: string,
  input: ActualizarTipoHoraExtraInput,
): Promise<TipoHoraExtra> {
  const { data } = await apiClient.patch<TipoHoraExtra>(`/tipos-hora-extra/${id}`, input);
  return data;
}

export async function listarFeriados(anio?: number): Promise<Feriado[]> {
  const { data } = await apiClient.get<Feriado[]>('/feriados', {
    params: anio ? { anio } : undefined,
  });
  return data;
}

export interface CrearFeriadoInput {
  fecha: string;
  descripcion: string;
}

export async function crearFeriado(input: CrearFeriadoInput): Promise<Feriado> {
  const { data } = await apiClient.post<Feriado>('/feriados', input);
  return data;
}

export async function eliminarFeriado(id: string): Promise<void> {
  await apiClient.delete(`/feriados/${id}`);
}
