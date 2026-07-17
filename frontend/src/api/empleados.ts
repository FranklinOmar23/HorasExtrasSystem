import { apiClient } from './client';
import type { Empleado, Salario } from '../types/api';

export interface FiltroEmpleados {
  search?: string;
  activo?: boolean;
}

export interface SalarioInicialInput {
  montoMensual: string;
  vigenteDesde: string;
}

export interface CrearEmpleadoInput {
  codigo: number;
  nombre: string;
  cedula?: string;
  posicion: string;
  salarioInicial: SalarioInicialInput;
}

export interface ActualizarEmpleadoInput {
  nombre?: string;
  cedula?: string;
  posicion?: string;
  activo?: boolean;
}

export interface CrearSalarioInput {
  montoMensual: string;
  vigenteDesde: string;
}

export async function listarEmpleados(filtro: FiltroEmpleados = {}): Promise<Empleado[]> {
  const { data } = await apiClient.get<Empleado[]>('/empleados', { params: filtro });
  return data;
}

export async function obtenerEmpleado(id: string): Promise<Empleado> {
  const { data } = await apiClient.get<Empleado>(`/empleados/${id}`);
  return data;
}

export async function crearEmpleado(input: CrearEmpleadoInput): Promise<Empleado> {
  const { data } = await apiClient.post<Empleado>('/empleados', input);
  return data;
}

export async function actualizarEmpleado(id: string, input: ActualizarEmpleadoInput): Promise<Empleado> {
  const { data } = await apiClient.patch<Empleado>(`/empleados/${id}`, input);
  return data;
}

export async function listarSalarios(empleadoId: string): Promise<Salario[]> {
  const { data } = await apiClient.get<Salario[]>(`/empleados/${empleadoId}/salarios`);
  return data;
}

export async function crearSalario(empleadoId: string, input: CrearSalarioInput): Promise<Salario> {
  const { data } = await apiClient.post<Salario>(`/empleados/${empleadoId}/salarios`, input);
  return data;
}
