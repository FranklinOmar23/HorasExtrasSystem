import { RolUsuario } from '../enums/rol-usuario.enum';

export class Usuario {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly rol: RolUsuario,
    public readonly activo: boolean,
  ) {}

  esAdmin(): boolean {
    return this.rol === RolUsuario.ADMIN;
  }
}
