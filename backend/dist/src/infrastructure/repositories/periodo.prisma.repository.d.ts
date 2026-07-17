import { CrearPeriodoDatos, PeriodoRepository } from '../../application/ports/periodo.repository.port';
import { Periodo } from '../../domain/entities/periodo.entity';
import { PrismaService } from '../prisma/prisma.service';
export declare class PeriodoPrismaRepository implements PeriodoRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listar(): Promise<Periodo[]>;
    buscarPorId(id: string): Promise<Periodo | null>;
    buscarPorFechas(fechaInicio: Date, fechaFin: Date): Promise<Periodo | null>;
    crear(datos: CrearPeriodoDatos): Promise<Periodo>;
    cerrar(id: string, cerradoPorId: string, cerradoEn: Date): Promise<Periodo>;
}
