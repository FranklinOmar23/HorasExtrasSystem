import {
  AuditoriaConUsuario,
  AuditoriaRepository,
  FiltroAuditoria,
} from '../../ports/auditoria.repository.port';

export const PAGINA_DEFECTO = 1;
export const POR_PAGINA_DEFECTO = 25;
export const POR_PAGINA_MAXIMO = 100;

export interface FiltroListarAuditoria {
  entidad?: FiltroAuditoria['entidad'];
  usuarioId?: string;
  desde?: Date;
  hasta?: Date;
  pagina?: number;
  porPagina?: number;
}

export interface ResultadoListarAuditoria {
  items: AuditoriaConUsuario[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export class ListarAuditoriaUseCase {
  constructor(private readonly repository: AuditoriaRepository) {}

  async ejecutar(
    filtro: FiltroListarAuditoria,
  ): Promise<ResultadoListarAuditoria> {
    const pagina = Math.max(1, filtro.pagina ?? PAGINA_DEFECTO);
    const porPagina = Math.min(
      POR_PAGINA_MAXIMO,
      Math.max(1, filtro.porPagina ?? POR_PAGINA_DEFECTO),
    );

    const { items, total } = await this.repository.listar({
      entidad: filtro.entidad,
      usuarioId: filtro.usuarioId,
      desde: filtro.desde,
      hasta: filtro.hasta,
      pagina,
      porPagina,
    });

    return {
      items,
      total,
      pagina,
      porPagina,
      totalPaginas: Math.max(1, Math.ceil(total / porPagina)),
    };
  }
}
