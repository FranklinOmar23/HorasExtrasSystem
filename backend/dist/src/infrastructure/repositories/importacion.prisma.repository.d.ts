import { CrearImportacionDatos, ImportacionRepository } from '../../application/ports/importacion.repository.port';
import { Importacion } from '../../domain/entities/importacion.entity';
import { PrismaService } from '../prisma/prisma.service';
export declare class ImportacionPrismaRepository implements ImportacionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    crear(datos: CrearImportacionDatos): Promise<Importacion>;
    buscarPorId(id: string): Promise<Importacion | null>;
    obtenerContenido(id: string): Promise<Buffer | null>;
    listarPorPeriodo(periodoId: string): Promise<Importacion[]>;
    marcarConfirmada(id: string, confirmadaEn: Date): Promise<Importacion>;
}
