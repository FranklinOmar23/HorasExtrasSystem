import { Periodo } from '../../../domain/entities/periodo.entity';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
export declare class CerrarPeriodoUseCase {
    private readonly repository;
    constructor(repository: PeriodoRepository);
    ejecutar(id: string, cerradoPorId: string): Promise<Periodo>;
}
