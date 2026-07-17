import { ConfiguracionRepository } from '../../application/ports/configuracion.repository.port';
import { PrismaService } from '../prisma/prisma.service';
export declare class ConfiguracionPrismaRepository implements ConfiguracionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    obtenerTodos(): Promise<Record<string, string>>;
    actualizar(cambios: Record<string, string>): Promise<Record<string, string>>;
}
