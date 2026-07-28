import { AsignacionTurno } from '../../domain/entities/asignacion-turno.entity';

export const ASIGNACION_TURNO_REPOSITORY = Symbol('ASIGNACION_TURNO_REPOSITORY');

export interface CrearAsignacionTurnoDatos {
  empleadoId: string;
  turnoId: string;
  fechaDesde: Date;
  fechaHasta: Date | null;
  comentario: string | null;
  creadoPorId: string;
}

export interface ActualizarAsignacionTurnoDatos {
  turnoId?: string;
  fechaDesde?: Date;
  fechaHasta?: Date | null;
  comentario?: string | null;
}

export interface AsignacionTurnoRepository {
  /** Todas las asignaciones del empleado (para mostrarlas y para chequear solapamiento). */
  listarPorEmpleado(empleadoId: string): Promise<AsignacionTurno[]>;
  buscarPorId(id: string): Promise<AsignacionTurno | null>;
  /** Asignación vigente del empleado en una fecha (fechaDesde <= fecha <= fechaHasta|∞). */
  buscarVigenteEn(empleadoId: string, fecha: Date): Promise<AsignacionTurno | null>;
  /** true si existe alguna asignación (de cualquier empleado) que use este turno. */
  existeAlgunaConTurno(turnoId: string): Promise<boolean>;
  crear(datos: CrearAsignacionTurnoDatos): Promise<AsignacionTurno>;
  actualizar(
    id: string,
    datos: ActualizarAsignacionTurnoDatos,
  ): Promise<AsignacionTurno>;
  eliminar(id: string): Promise<void>;
}
