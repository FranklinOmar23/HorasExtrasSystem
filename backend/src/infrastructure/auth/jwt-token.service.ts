import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, TokenService } from '../../application/ports/token.port';
import { Usuario } from '../../domain/entities/usuario.entity';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generar(usuario: Usuario): string {
    const payload: TokenPayload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };
    return this.jwtService.sign(payload);
  }
}
