import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { RegistroHorasRepository } from '../../ports/registro-horas.repository.port';
export declare class EliminarRegistroUseCase {
    private readonly periodoRepository;
    private readonly registroHorasRepository;
    constructor(periodoRepository: PeriodoRepository, registroHorasRepository: RegistroHorasRepository);
    ejecutar(id: string): Promise<void>;
}
