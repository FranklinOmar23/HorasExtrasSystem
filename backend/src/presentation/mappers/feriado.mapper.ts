import { Feriado } from '../../domain/entities/feriado.entity';
import { FeriadoRespuestaDto } from '../dtos/feriados/feriado-respuesta.dto';

export function aFeriadoRespuestaDto(feriado: Feriado): FeriadoRespuestaDto {
  return {
    id: feriado.id,
    fecha: feriado.fecha.toISOString().slice(0, 10),
    descripcion: feriado.descripcion,
  };
}
