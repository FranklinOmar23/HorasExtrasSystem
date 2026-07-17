import { Periodo } from '../../../domain/entities/periodo.entity';
import { CrearPeriodoDatos, PeriodoRepository } from '../../ports/periodo.repository.port';
export declare class CrearPeriodoUseCase {
    private readonly repository;
    constructor(repository: PeriodoRepository);
    ejecutar(datos: CrearPeriodoDatos): Promise<Periodo>;
}
