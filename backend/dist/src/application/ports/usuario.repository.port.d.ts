import { Usuario } from '../../domain/entities/usuario.entity';
import { RolUsuario } from '../../domain/enums/rol-usuario.enum';
export declare const USUARIO_REPOSITORY: unique symbol;
export interface CrearUsuarioDatos {
    nombre: string;
    email: string;
    passwordHash: string;
    rol: RolUsuario;
}
export interface ActualizarUsuarioDatos {
    nombre?: string;
    rol?: RolUsuario;
    activo?: boolean;
    passwordHash?: string;
}
export interface UsuarioRepository {
    listar(): Promise<Usuario[]>;
    buscarPorEmail(email: string): Promise<Usuario | null>;
    buscarPorId(id: string): Promise<Usuario | null>;
    crear(datos: CrearUsuarioDatos): Promise<Usuario>;
    actualizar(id: string, datos: ActualizarUsuarioDatos): Promise<Usuario>;
}
