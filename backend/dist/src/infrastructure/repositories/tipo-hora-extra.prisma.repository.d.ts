import { ActualizarTipoHoraExtraDatos, TipoHoraExtraRepository } from '../../application/ports/tipo-hora-extra.repository.port';
import { TipoHoraExtra } from '../../domain/entities/tipo-hora-extra.entity';
import { PrismaService } from '../prisma/prisma.service';
export declare class TipoHoraExtraPrismaRepository implements TipoHoraExtraRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listar(): Promise<TipoHoraExtra[]>;
    buscarPorId(id: string): Promise<TipoHoraExtra | null>;
    actualizar(id: string, datos: ActualizarTipoHoraExtraDatos): Promise<TipoHoraExtra>;
}
