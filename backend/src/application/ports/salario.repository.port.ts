import Decimal from 'decimal.js';
import { Salario } from '../../domain/entities/salario.entity';

export const SALARIO_REPOSITORY = Symbol('SALARIO_REPOSITORY');

export interface CrearSalarioDatos {
  montoMensual: Decimal;
  vigenteDesde: Date;
}

export interface SalarioRepository {
  listarPorEmpleado(empleadoId: string): Promise<Salario[]>;
  /** Crea el nuevo salario y cierra (vigenteHasta) el salario vigente anterior, si existe. */
  crear(
    empleadoId: string,
    datos: CrearSalarioDatos,
    cerrarVigenteAnteriorHasta: Date,
  ): Promise<Salario>;
  /** Salario vigente del empleado en una fecha dada (vigenteDesde <= fecha <= vigenteHasta|∞). */
  buscarVigenteEn(empleadoId: string, fecha: Date): Promise<Salario | null>;
}
