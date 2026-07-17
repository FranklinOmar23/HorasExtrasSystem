export const CONFIGURACION_REPOSITORY = Symbol('CONFIGURACION_REPOSITORY');

export interface ConfiguracionRepository {
  obtenerTodos(): Promise<Record<string, string>>;
  actualizar(cambios: Record<string, string>): Promise<Record<string, string>>;
}
