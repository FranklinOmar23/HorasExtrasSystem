import { apiClient } from './client';
import type { RolUsuario, Usuario } from '../types/api';

export interface CrearUsuarioInput {
  nombre: string;
  email: string;
  password: string;
  rol: RolUsuario;
}

export interface ActualizarUsuarioInput {
  nombre?: string;
  rol?: RolUsuario;
  activo?: boolean;
  password?: string;
}

export async function listarUsuarios(): Promise<Usuario[]> {
  const { data } = await apiClient.get<Usuario[]>('/usuarios');
  return data;
}

export async function crearUsuario(input: CrearUsuarioInput): Promise<Usuario> {
  const { data } = await apiClient.post<Usuario>('/usuarios', input);
  return data;
}

export async function actualizarUsuario(id: string, input: ActualizarUsuarioInput): Promise<Usuario> {
  const { data } = await apiClient.patch<Usuario>(`/usuarios/${id}`, input);
  return data;
}
