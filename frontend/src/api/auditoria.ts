import { apiClient } from './client';
import type { Auditoria, EntidadAuditoria } from '../types/api';

export interface FiltroAuditoria {
  entidad?: EntidadAuditoria;
  desde?: string;
  hasta?: string;
  pagina?: number;
  porPagina?: number;
}

export interface AuditoriaPaginada {
  items: Auditoria[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export async function listarAuditoria(filtro: FiltroAuditoria = {}): Promise<AuditoriaPaginada> {
  const { data } = await apiClient.get<AuditoriaPaginada>('/auditoria', { params: filtro });
  return data;
}
