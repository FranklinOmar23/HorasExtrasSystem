import { RolUsuario } from '../enums/rol-usuario.enum';
export declare class Usuario {
    readonly id: string;
    readonly nombre: string;
    readonly email: string;
    readonly passwordHash: string;
    readonly rol: RolUsuario;
    readonly activo: boolean;
    constructor(id: string, nombre: string, email: string, passwordHash: string, rol: RolUsuario, activo: boolean);
    esAdmin(): boolean;
}
