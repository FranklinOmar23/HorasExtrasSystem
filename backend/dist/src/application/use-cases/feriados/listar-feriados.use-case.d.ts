import { Feriado } from '../../../domain/entities/feriado.entity';
import { FeriadoRepository } from '../../ports/feriado.repository.port';
export declare class ListarFeriadosUseCase {
    private readonly repository;
    constructor(repository: FeriadoRepository);
    ejecutar(anio?: number): Promise<Feriado[]>;
}
