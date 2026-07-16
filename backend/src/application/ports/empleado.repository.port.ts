import Decimal from 'decimal.js';
import { Empleado } from '../../domain/entities/empleado.entity';

export const EMPLEADO_REPOSITORY = Symbol('EMPLEADO_REPOSITORY');

export interface CrearEmpleadoDatos {
  codigo: number;
  nombre: string;
  cedula: string | null;
  posicion: string;
  salarioInicial: {
    montoMensual: Decimal;
    vigenteDesde: Date;
  };
}

export interface ActualizarEmpleadoDatos {
  nombre?: string;
  cedula?: string | null;
  posicion?: string;
  activo?: boolean;
}

export interface FiltroEmpleados {
  search?: string;
  activo?: boolean;
}

export interface EmpleadoRepository {
  listar(filtro: FiltroEmpleados): Promise<Empleado[]>;
  buscarPorId(id: string): Promise<Empleado | null>;
  buscarPorCodigo(codigo: number): Promise<Empleado | null>;
  buscarPorCedula(cedula: string): Promise<Empleado | null>;
  crear(datos: CrearEmpleadoDatos): Promise<Empleado>;
  actualizar(id: string, datos: ActualizarEmpleadoDatos): Promise<Empleado>;
}
