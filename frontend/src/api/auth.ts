import { apiClient } from './client';
import type { LoginRespuesta } from '../types/api';

export async function login(email: string, password: string): Promise<LoginRespuesta> {
  const { data } = await apiClient.post<LoginRespuesta>('/auth/login', { email, password });
  return data;
}
