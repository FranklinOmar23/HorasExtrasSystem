declare class UsuarioRespuestaDto {
    id: string;
    nombre: string;
    email: string;
    rol: string;
}
export declare class LoginRespuestaDto {
    accessToken: string;
    usuario: UsuarioRespuestaDto;
}
export {};
