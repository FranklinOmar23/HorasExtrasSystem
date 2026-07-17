import { TipoHoraExtra } from '../../../domain/entities/tipo-hora-extra.entity';
import { ActualizarTipoHoraExtraDatos, TipoHoraExtraRepository } from '../../ports/tipo-hora-extra.repository.port';
export declare class ActualizarTipoHoraExtraUseCase {
    private readonly repository;
    constructor(repository: TipoHoraExtraRepository);
    ejecutar(id: string, datos: ActualizarTipoHoraExtraDatos): Promise<TipoHoraExtra>;
}
