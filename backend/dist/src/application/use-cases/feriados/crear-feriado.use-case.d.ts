import { Feriado } from '../../../domain/entities/feriado.entity';
import { CrearFeriadoDatos, FeriadoRepository } from '../../ports/feriado.repository.port';
export declare class CrearFeriadoUseCase {
    private readonly repository;
    constructor(repository: FeriadoRepository);
    ejecutar(datos: CrearFeriadoDatos): Promise<Feriado>;
}
