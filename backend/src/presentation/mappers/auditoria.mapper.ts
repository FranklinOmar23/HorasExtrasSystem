import { AuditoriaConUsuario } from '../../application/ports/auditoria.repository.port';
import { ResultadoListarAuditoria } from '../../application/use-cases/auditoria/listar-auditoria.use-case';
import { AuditoriaPaginadaRespuestaDto } from '../dtos/auditoria/auditoria-paginada-respuesta.dto';
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

export function aAuditoriaPaginadaRespuestaDto(
  resultado: ResultadoListarAuditoria,
): AuditoriaPaginadaRespuestaDto {
  return {
    items: resultado.items.map(aAuditoriaRespuestaDto),
    total: resultado.total,
    pagina: resultado.pagina,
    porPagina: resultado.porPagina,
    totalPaginas: resultado.totalPaginas,
  };
}
