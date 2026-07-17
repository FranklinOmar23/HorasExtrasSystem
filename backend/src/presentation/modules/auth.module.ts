import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PASSWORD_HASHER } from '../../application/ports/password-hasher.port';
import type { PasswordHasher } from '../../application/ports/password-hasher.port';
import { TOKEN_SERVICE } from '../../application/ports/token.port';
import type { TokenService } from '../../application/ports/token.port';
import { USUARIO_REPOSITORY } from '../../application/ports/usuario.repository.port';
import type { UsuarioRepository } from '../../application/ports/usuario.repository.port';
import { AutenticarUsuarioUseCase } from '../../application/use-cases/auth/autenticar-usuario.use-case';
import { BcryptPasswordHasher } from '../../infrastructure/auth/bcrypt-password-hasher';
import { JwtStrategy } from '../../infrastructure/auth/jwt.strategy';
import { JwtTokenService } from '../../infrastructure/auth/jwt-token.service';
import { UsuarioPrismaRepository } from '../../infrastructure/repositories/usuario.prisma.repository';
import { AuthController } from '../controllers/auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '8h') as never,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    { provide: USUARIO_REPOSITORY, useClass: UsuarioPrismaRepository },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
    {
      provide: AutenticarUsuarioUseCase,
      useFactory: (
        usuarioRepository: UsuarioRepository,
        passwordHasher: PasswordHasher,
        tokenService: TokenService,
      ) =>
        new AutenticarUsuarioUseCase(
          usuarioRepository,
          passwordHasher,
          tokenService,
        ),
      inject: [USUARIO_REPOSITORY, PASSWORD_HASHER, TOKEN_SERVICE],
    },
  ],
  exports: [USUARIO_REPOSITORY, PASSWORD_HASHER],
})
export class AuthModule {}
