import { Periodo } from '../../domain/entities/periodo.entity';
import { PeriodoRespuestaDto } from '../dtos/periodos/periodo-respuesta.dto';

function aFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

export function aPeriodoRespuestaDto(periodo: Periodo): PeriodoRespuestaDto {
  return {
    id: periodo.id,
    fechaInicio: aFechaISO(periodo.fechaInicio),
    fechaFin: aFechaISO(periodo.fechaFin),
    estado: periodo.estado,
    cerradoEn: periodo.cerradoEn ? periodo.cerradoEn.toISOString() : null,
    cerradoPorId: periodo.cerradoPorId,
    eliminadoEn: periodo.eliminadoEn ? periodo.eliminadoEn.toISOString() : null,
    eliminadoPorId: periodo.eliminadoPorId,
  };
}
