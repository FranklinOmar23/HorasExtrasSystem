import { AsignacionTurno } from '../../domain/entities/asignacion-turno.entity';
import { AsignacionTurnoRespuestaDto } from '../dtos/asignaciones-turno/asignacion-turno-respuesta.dto';

function aFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

export function aAsignacionTurnoRespuestaDto(
  asignacion: AsignacionTurno,
): AsignacionTurnoRespuestaDto {
  return {
    id: asignacion.id,
    empleadoId: asignacion.empleadoId,
    turnoId: asignacion.turnoId,
    fechaDesde: aFechaISO(asignacion.fechaDesde),
    fechaHasta: asignacion.fechaHasta ? aFechaISO(asignacion.fechaHasta) : null,
    comentario: asignacion.comentario,
    creadoPorId: asignacion.creadoPorId,
    createdAt: asignacion.createdAt.toISOString(),
  };
}
