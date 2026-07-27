import { AccionAuditoria } from '../enums/accion-auditoria.enum';
import { EntidadAuditoria } from '../enums/entidad-auditoria.enum';

export class Auditoria {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly accion: AccionAuditoria,
    public readonly entidad: EntidadAuditoria,
    public readonly entidadId: string | null,
    public readonly descripcion: string,
    public readonly creadoEn: Date,
  ) {}
}
