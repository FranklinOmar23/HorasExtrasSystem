export declare const CONFIGURACION_REPOSITORY: unique symbol;
export interface ConfiguracionRepository {
    obtenerTodos(): Promise<Record<string, string>>;
    actualizar(cambios: Record<string, string>): Promise<Record<string, string>>;
}
