import { Usuario } from '../../domain/entities/usuario.entity';
export declare const TOKEN_SERVICE: unique symbol;
export interface TokenPayload {
    sub: string;
    email: string;
    rol: string;
}
export interface TokenService {
    generar(usuario: Usuario): string;
}
