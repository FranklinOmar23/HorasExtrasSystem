import { RolUsuario } from '../../../domain/enums/rol-usuario.enum';
export declare class UsuarioRespuestaDto {
    id: string;
    nombre: string;
    email: string;
    rol: RolUsuario;
    activo: boolean;
}
