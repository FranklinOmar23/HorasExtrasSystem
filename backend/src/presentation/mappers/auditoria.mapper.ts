import { AuditoriaConUsuario } from '../../application/ports/auditoria.repository.port';
import { AuditoriaRespuestaDto } from '../dtos/auditoria/auditoria-respuesta.dto';

export function aAuditoriaRespuestaDto(
  auditoria: AuditoriaConUsuario,
): AuditoriaRespuestaDto {
  return {
    id: auditoria.id,
    usuarioId: auditoria.usuarioId,
    usuarioNombre: auditoria.usuarioNombre,
    accion: auditoria.accion,
    entidad: auditoria.entidad,
    entidadId: auditoria.entidadId,
    descripcion: auditoria.descripcion,
    creadoEn: auditoria.creadoEn.toISOString(),
  };
}
