import { Empleado } from '../../domain/entities/empleado.entity';

export const EMPLEADO_REPOSITORY = Symbol('EMPLEADO_REPOSITORY');

export interface CrearEmpleadoDatos {
  codigo: string;
  nombre: string;
  cargo: string | null;
}

export interface EmpleadoRepository {
  listar(): Promise<Empleado[]>;
  buscarPorId(id: string): Promise<Empleado | null>;
  buscarPorCodigo(codigo: string): Promise<Empleado | null>;
  crear(datos: CrearEmpleadoDatos): Promise<Empleado>;
}
