import { apiClient } from './client';
import type { Auditoria, EntidadAuditoria } from '../types/api';

export interface FiltroAuditoria {
  entidad?: EntidadAuditoria;
  desde?: string;
  hasta?: string;
}

export async function listarAuditoria(filtro: FiltroAuditoria = {}): Promise<Auditoria[]> {
  const { data } = await apiClient.get<Auditoria[]>('/auditoria', { params: filtro });
  return data;
}
