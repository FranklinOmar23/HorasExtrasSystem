import { Turno } from '../../domain/entities/turno.entity';
import { TurnoRespuestaDto } from '../dtos/turnos/turno-respuesta.dto';

export function aTurnoRespuestaDto(turno: Turno): TurnoRespuestaDto {
  return {
    id: turno.id,
    codigo: turno.codigo,
    nombre: turno.nombre,
    horaInicio: turno.horaInicio,
    horaFin: turno.horaFin,
    horasJornada: turno.horasJornada.toFixed(2),
    cruzaMedianoche: turno.cruzaMedianoche,
    descuentaAlmuerzo: turno.descuentaAlmuerzo,
    activo: turno.activo,
  };
}
