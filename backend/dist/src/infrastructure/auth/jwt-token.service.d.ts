import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../application/ports/token.port';
import { Usuario } from '../../domain/entities/usuario.entity';
export declare class JwtTokenService implements TokenService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generar(usuario: Usuario): string;
}
