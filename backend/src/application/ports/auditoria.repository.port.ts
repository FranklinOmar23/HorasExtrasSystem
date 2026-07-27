import { Auditoria } from '../../domain/entities/auditoria.entity';
import { AccionAuditoria } from '../../domain/enums/accion-auditoria.enum';
import { EntidadAuditoria } from '../../domain/enums/entidad-auditoria.enum';

export const AUDITORIA_REPOSITORY = Symbol('AUDITORIA_REPOSITORY');

export interface RegistrarAuditoriaDatos {
  usuarioId: string;
  accion: AccionAuditoria;
  entidad: EntidadAuditoria;
  entidadId: string | null;
  descripcion: string;
}

export interface FiltroAuditoria {
  entidad?: EntidadAuditoria;
  usuarioId?: string;
  desde?: Date;
  hasta?: Date;
}

/** Fila de auditoría enriquecida con el nombre del usuario, para la vista de lectura. */
export interface AuditoriaConUsuario {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  accion: AccionAuditoria;
  entidad: EntidadAuditoria;
  entidadId: string | null;
  descripcion: string;
  creadoEn: Date;
}

export interface AuditoriaRepository {
  registrar(datos: RegistrarAuditoriaDatos): Promise<Auditoria>;
  listar(filtro: FiltroAuditoria): Promise<AuditoriaConUsuario[]>;
}
