import { FeriadoRepository } from '../../ports/feriado.repository.port';
export declare class EliminarFeriadoUseCase {
    private readonly repository;
    constructor(repository: FeriadoRepository);
    ejecutar(id: string): Promise<void>;
}
