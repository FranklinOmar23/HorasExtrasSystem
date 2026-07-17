import { ActualizarRegistroDatos, CrearRegistroDatos, RegistroConCalculos, RegistroHorasRepository } from '../../application/ports/registro-horas.repository.port';
import { FilaCalculo } from '../../domain/services/motor-calculo';
import { PrismaService } from '../prisma/prisma.service';
export declare class RegistroHorasPrismaRepository implements RegistroHorasRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private mapaCodigosPorTipoId;
    listarPorPeriodo(periodoId: string, empleadoId?: string): Promise<RegistroConCalculos[]>;
    buscarPorId(id: string): Promise<RegistroConCalculos | null>;
    crear(datos: CrearRegistroDatos, filas: FilaCalculo[]): Promise<RegistroConCalculos>;
    actualizar(id: string, datos: ActualizarRegistroDatos, filas: FilaCalculo[]): Promise<RegistroConCalculos>;
    eliminar(id: string): Promise<void>;
}
