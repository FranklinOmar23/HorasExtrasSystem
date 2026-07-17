import { ActualizarEmpleadoDatos, CrearEmpleadoDatos, EmpleadoRepository, FiltroEmpleados } from '../../application/ports/empleado.repository.port';
import { Empleado } from '../../domain/entities/empleado.entity';
import { PrismaService } from '../prisma/prisma.service';
export declare class EmpleadoPrismaRepository implements EmpleadoRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listar(filtro: FiltroEmpleados): Promise<Empleado[]>;
    buscarPorId(id: string): Promise<Empleado | null>;
    buscarPorCodigo(codigo: number): Promise<Empleado | null>;
    buscarPorCedula(cedula: string): Promise<Empleado | null>;
    crear(datos: CrearEmpleadoDatos): Promise<Empleado>;
    actualizar(id: string, datos: ActualizarEmpleadoDatos): Promise<Empleado>;
}
