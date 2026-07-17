import { RolUsuario } from '../../../domain/enums/rol-usuario.enum';
export declare class ActualizarUsuarioDto {
    nombre?: string;
    rol?: RolUsuario;
    activo?: boolean;
    password?: string;
}
