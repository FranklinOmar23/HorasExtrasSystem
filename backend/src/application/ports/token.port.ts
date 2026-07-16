import { Usuario } from '../../domain/entities/usuario.entity';

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');

export interface TokenPayload {
  sub: string;
  email: string;
  rol: string;
}

export interface TokenService {
  generar(usuario: Usuario): string;
}
