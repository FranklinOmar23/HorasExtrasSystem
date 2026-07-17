import { RolUsuario } from '../../../domain/enums/rol-usuario.enum';
export declare class CrearUsuarioDto {
    nombre: string;
    email: string;
    password: string;
    rol: RolUsuario;
}
