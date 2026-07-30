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
  /** Filtra por el salario mensual VIGENTE (no el histórico). */
  salarioMin?: Decimal;
  salarioMax?: Decimal;
  /** 1-based. */
  pagina: number;
  porPagina: number;
}

/** Fila de empleado enriquecida con su salario vigente, para la lista
 *  (resuelto por `vw_empleados` — ver docs/03). */
export interface EmpleadoConSalario {
  id: string;
  codigo: number;
  nombre: string;
  cedula: string | null;
  posicion: string;
  activo: boolean;
  montoMensualVigente: Decimal | null;
}

export interface EmpleadosPaginados {
  items: EmpleadoConSalario[];
  total: number;
}

export interface EmpleadoRepository {
  listar(filtro: FiltroEmpleados): Promise<EmpleadosPaginados>;
  buscarPorId(id: string): Promise<Empleado | null>;
  buscarPorCodigo(codigo: number): Promise<Empleado | null>;
  buscarPorCedula(cedula: string): Promise<Empleado | null>;
  crear(datos: CrearEmpleadoDatos): Promise<Empleado>;
  actualizar(id: string, datos: ActualizarEmpleadoDatos): Promise<Empleado>;
}
