import { ActualizarUsuarioDatos, CrearUsuarioDatos, UsuarioRepository } from '../../application/ports/usuario.repository.port';
import { Usuario } from '../../domain/entities/usuario.entity';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsuarioPrismaRepository implements UsuarioRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listar(): Promise<Usuario[]>;
    buscarPorEmail(email: string): Promise<Usuario | null>;
    buscarPorId(id: string): Promise<Usuario | null>;
    crear(datos: CrearUsuarioDatos): Promise<Usuario>;
    actualizar(id: string, datos: ActualizarUsuarioDatos): Promise<Usuario>;
}
