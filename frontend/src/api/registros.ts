import { apiClient } from './client';
import type { Calculo, RegistroHoras } from '../types/api';

export interface CrearRegistroInput {
  periodoId: string;
  empleadoId: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  comentario?: string;
}

export interface ActualizarRegistroInput {
  fecha?: string;
  horaEntrada?: string;
  horaSalida?: string;
  comentario?: string;
}

export interface PreviewCalculoInput {
  empleadoId: string;
  periodoId: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
}

export interface PreviewCalculoRespuesta {
  calculos: Calculo[];
  esRetroactivo: boolean;
}

export async function listarRegistros(periodoId: string, empleadoId?: string): Promise<RegistroHoras[]> {
  const { data } = await apiClient.get<RegistroHoras[]>(`/periodos/${periodoId}/registros`, {
    params: empleadoId ? { empleadoId } : undefined,
  });
  return data;
}

export async function crearRegistro(input: CrearRegistroInput): Promise<RegistroHoras> {
  const { data } = await apiClient.post<RegistroHoras>('/registros', input);
  return data;
}

export async function actualizarRegistro(id: string, input: ActualizarRegistroInput): Promise<RegistroHoras> {
  const { data } = await apiClient.patch<RegistroHoras>(`/registros/${id}`, input);
  return data;
}

export async function eliminarRegistro(id: string): Promise<void> {
  await apiClient.delete(`/registros/${id}`);
}

export async function previewCalculo(input: PreviewCalculoInput): Promise<PreviewCalculoRespuesta> {
  const { data } = await apiClient.post<PreviewCalculoRespuesta>('/registros/preview', input);
  return data;
}
