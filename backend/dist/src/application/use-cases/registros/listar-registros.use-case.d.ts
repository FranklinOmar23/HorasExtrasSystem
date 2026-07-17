import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { RegistroConCalculos, RegistroHorasRepository } from '../../ports/registro-horas.repository.port';
export declare class ListarRegistrosUseCase {
    private readonly periodoRepository;
    private readonly registroHorasRepository;
    constructor(periodoRepository: PeriodoRepository, registroHorasRepository: RegistroHorasRepository);
    ejecutar(periodoId: string, empleadoId?: string): Promise<RegistroConCalculos[]>;
}
