export interface ParametrosPaginacion {
  /** 1-based. */
  pagina: number;
  porPagina: number;
}

/** Normaliza pagina/porPagina de un query (posiblemente undefined o fuera de
 *  rango) a valores seguros: pagina >= 1, 1 <= porPagina <= porPaginaMaximo. */
export function normalizarPaginacion(
  pagina: number | undefined,
  porPagina: number | undefined,
  porPaginaPorDefecto: number,
  porPaginaMaximo: number,
): ParametrosPaginacion {
  return {
    pagina: Math.max(1, pagina ?? 1),
    porPagina: Math.min(porPaginaMaximo, Math.max(1, porPagina ?? porPaginaPorDefecto)),
  };
}

export function totalPaginas(total: number, porPagina: number): number {
  return Math.max(1, Math.ceil(total / porPagina));
}
