import { ConfiguracionRepository } from '../../ports/configuracion.repository.port';
export declare class ObtenerConfiguracionUseCase {
    private readonly repository;
    constructor(repository: ConfiguracionRepository);
    ejecutar(): Promise<Record<string, string>>;
}
