import Decimal from 'decimal.js';
import { Salario } from '../../domain/entities/salario.entity';
export declare const SALARIO_REPOSITORY: unique symbol;
export interface CrearSalarioDatos {
    montoMensual: Decimal;
    vigenteDesde: Date;
}
export interface SalarioRepository {
    listarPorEmpleado(empleadoId: string): Promise<Salario[]>;
    crear(empleadoId: string, datos: CrearSalarioDatos, cerrarVigenteAnteriorHasta: Date): Promise<Salario>;
    buscarVigenteEn(empleadoId: string, fecha: Date): Promise<Salario | null>;
}
