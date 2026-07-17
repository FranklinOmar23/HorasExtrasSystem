import { CrearFeriadoDatos, FeriadoRepository } from '../../application/ports/feriado.repository.port';
import { Feriado } from '../../domain/entities/feriado.entity';
import { PrismaService } from '../prisma/prisma.service';
export declare class FeriadoPrismaRepository implements FeriadoRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listar(anio?: number): Promise<Feriado[]>;
    buscarPorId(id: string): Promise<Feriado | null>;
    buscarPorFecha(fecha: Date): Promise<Feriado | null>;
    crear(datos: CrearFeriadoDatos): Promise<Feriado>;
    eliminar(id: string): Promise<void>;
}
