import { CrearSalarioDatos, SalarioRepository } from '../../application/ports/salario.repository.port';
import { Salario } from '../../domain/entities/salario.entity';
import { PrismaService } from '../prisma/prisma.service';
export declare class SalarioPrismaRepository implements SalarioRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listarPorEmpleado(empleadoId: string): Promise<Salario[]>;
    crear(empleadoId: string, datos: CrearSalarioDatos, cerrarVigenteAnteriorHasta: Date): Promise<Salario>;
}
