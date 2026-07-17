import { ConfiguracionRepository } from '../../ports/configuracion.repository.port';
export declare class ActualizarConfiguracionUseCase {
    private readonly repository;
    constructor(repository: ConfiguracionRepository);
    ejecutar(cambios: Record<string, string>): Promise<Record<string, string>>;
}
