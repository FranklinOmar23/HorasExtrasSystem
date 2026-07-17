import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import type { UsuarioRepository } from '../../application/ports/usuario.repository.port';
import { TokenPayload } from '../../application/ports/token.port';
import { Usuario } from '../../domain/entities/usuario.entity';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usuarioRepository;
    constructor(configService: ConfigService, usuarioRepository: UsuarioRepository);
    validate(payload: TokenPayload): Promise<Usuario>;
}
export {};
