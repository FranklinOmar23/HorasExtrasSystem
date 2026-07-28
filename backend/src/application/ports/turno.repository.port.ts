import Decimal from 'decimal.js';
import { Turno } from '../../domain/entities/turno.entity';

export const TURNO_REPOSITORY = Symbol('TURNO_REPOSITORY');

export interface CrearTurnoDatos {
  codigo: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  horasJornada: Decimal;
  cruzaMedianoche: boolean;
  descuentaAlmuerzo: boolean;
}

export interface ActualizarTurnoDatos {
  nombre?: string;
  horaInicio?: string;
  horaFin?: string;
  horasJornada?: Decimal;
  cruzaMedianoche?: boolean;
  descuentaAlmuerzo?: boolean;
  activo?: boolean;
}

export interface TurnoRepository {
  listar(): Promise<Turno[]>;
  buscarPorId(id: string): Promise<Turno | null>;
  buscarPorCodigo(codigo: string): Promise<Turno | null>;
  crear(datos: CrearTurnoDatos): Promise<Turno>;
  actualizar(id: string, datos: ActualizarTurnoDatos): Promise<Turno>;
  eliminar(id: string): Promise<void>;
}
