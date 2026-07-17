import { TipoHoraExtra } from '../../../domain/entities/tipo-hora-extra.entity';
import { TipoHoraExtraRepository } from '../../ports/tipo-hora-extra.repository.port';
export declare class ListarTiposHoraExtraUseCase {
    private readonly repository;
    constructor(repository: TipoHoraExtraRepository);
    ejecutar(): Promise<TipoHoraExtra[]>;
}
