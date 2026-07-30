import {
  AuditoriaConUsuario,
  AuditoriaRepository,
  FiltroAuditoria,
} from '../../ports/auditoria.repository.port';
import { normalizarPaginacion, totalPaginas } from '../../services/paginacion.util';

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
    const { pagina, porPagina } = normalizarPaginacion(
      filtro.pagina,
      filtro.porPagina,
      POR_PAGINA_DEFECTO,
      POR_PAGINA_MAXIMO,
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
      totalPaginas: totalPaginas(total, porPagina),
    };
  }
}
