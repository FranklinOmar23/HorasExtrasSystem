import { CrearEmpleadoDatos, EmpleadoRepository } from '../../application/ports/empleado.repository.port';
import { Empleado } from '../../domain/entities/empleado.entity';
import { PrismaService } from '../prisma/prisma.service';
export declare class EmpleadoPrismaRepository implements EmpleadoRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listar(): Promise<Empleado[]>;
    buscarPorId(id: string): Promise<Empleado | null>;
    buscarPorCodigo(codigo: string): Promise<Empleado | null>;
    crear(datos: CrearEmpleadoDatos): Promise<Empleado>;
}
