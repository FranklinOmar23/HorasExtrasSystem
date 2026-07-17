import { Periodo } from '../../../domain/entities/periodo.entity';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
export declare class ListarPeriodosUseCase {
    private readonly repository;
    constructor(repository: PeriodoRepository);
    ejecutar(): Promise<Periodo[]>;
}
