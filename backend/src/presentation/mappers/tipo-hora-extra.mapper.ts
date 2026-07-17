import { TipoHoraExtra } from '../../domain/entities/tipo-hora-extra.entity';
import { TipoHoraExtraRespuestaDto } from '../dtos/tipos-hora-extra/tipo-hora-extra-respuesta.dto';

export function aTipoHoraExtraRespuestaDto(
  tipo: TipoHoraExtra,
): TipoHoraExtraRespuestaDto {
  return {
    id: tipo.id,
    codigo: tipo.codigo,
    nombre: tipo.nombre,
    porcentaje: tipo.porcentaje.toFixed(2),
    activo: tipo.activo,
  };
}
