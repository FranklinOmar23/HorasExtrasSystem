import { apiClient } from './client';
import type { Importacion, ParsearImportacionRespuesta } from '../types/api';

export async function subirImportacion(
  periodoId: string,
  archivo: File,
): Promise<ParsearImportacionRespuesta> {
  const formData = new FormData();
  formData.append('archivo', archivo);
  const { data } = await apiClient.post<ParsearImportacionRespuesta>(
    `/periodos/${periodoId}/importaciones`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

export async function confirmarImportacion(
  importacionId: string,
  incluirAdvertencias: boolean,
): Promise<Importacion> {
  const { data } = await apiClient.post<Importacion>(
    `/importaciones/${importacionId}/confirmar`,
    { incluirAdvertencias },
  );
  return data;
}

export async function listarImportaciones(periodoId: string): Promise<Importacion[]> {
  const { data } = await apiClient.get<Importacion[]>(`/periodos/${periodoId}/importaciones`);
  return data;
}
