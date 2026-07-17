import { Importacion } from '../../../domain/entities/importacion.entity';
import { ImportacionRepository } from '../../ports/importacion.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
export declare class ListarImportacionesUseCase {
    private readonly periodoRepository;
    private readonly importacionRepository;
    constructor(periodoRepository: PeriodoRepository, importacionRepository: ImportacionRepository);
    ejecutar(periodoId: string): Promise<Importacion[]>;
}
