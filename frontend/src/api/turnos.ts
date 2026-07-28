import { apiClient } from './client';
import type { Turno } from '../types/api';

export interface CrearTurnoInput {
  codigo: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  horasJornada: string;
  cruzaMedianoche: boolean;
  descuentaAlmuerzo: boolean;
}

export interface ActualizarTurnoInput {
  nombre?: string;
  horaInicio?: string;
  horaFin?: string;
  horasJornada?: string;
  cruzaMedianoche?: boolean;
  descuentaAlmuerzo?: boolean;
  activo?: boolean;
}

export async function listarTurnos(): Promise<Turno[]> {
  const { data } = await apiClient.get<Turno[]>('/turnos');
  return data;
}

export async function crearTurno(input: CrearTurnoInput): Promise<Turno> {
  const { data } = await apiClient.post<Turno>('/turnos', input);
  return data;
}

export async function actualizarTurno(id: string, input: ActualizarTurnoInput): Promise<Turno> {
  const { data } = await apiClient.patch<Turno>(`/turnos/${id}`, input);
  return data;
}

export async function eliminarTurno(id: string): Promise<void> {
  await apiClient.delete(`/turnos/${id}`);
}
