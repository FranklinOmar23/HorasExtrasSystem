import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USUARIO_REPOSITORY } from '../../application/ports/usuario.repository.port';
import type { UsuarioRepository } from '../../application/ports/usuario.repository.port';
import { TokenPayload } from '../../application/ports/token.port';
import { Usuario } from '../../domain/entities/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload): Promise<Usuario> {
    const usuario = await this.usuarioRepository.buscarPorId(payload.sub);
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('El usuario ya no tiene acceso.');
    }
    return usuario;
  }
}
