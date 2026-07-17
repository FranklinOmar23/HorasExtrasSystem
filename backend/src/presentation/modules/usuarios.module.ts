import { Module } from '@nestjs/common';
import { PASSWORD_HASHER } from '../../application/ports/password-hasher.port';
import type { PasswordHasher } from '../../application/ports/password-hasher.port';
import { USUARIO_REPOSITORY } from '../../application/ports/usuario.repository.port';
import type { UsuarioRepository } from '../../application/ports/usuario.repository.port';
import { ActualizarUsuarioUseCase } from '../../application/use-cases/usuarios/actualizar-usuario.use-case';
import { CrearUsuarioUseCase } from '../../application/use-cases/usuarios/crear-usuario.use-case';
import { ListarUsuariosUseCase } from '../../application/use-cases/usuarios/listar-usuarios.use-case';
import { UsuariosController } from '../controllers/usuarios.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsuariosController],
  providers: [
    {
      provide: ListarUsuariosUseCase,
      useFactory: (repo: UsuarioRepository) => new ListarUsuariosUseCase(repo),
      inject: [USUARIO_REPOSITORY],
    },
    {
      provide: CrearUsuarioUseCase,
      useFactory: (repo: UsuarioRepository, hasher: PasswordHasher) =>
        new CrearUsuarioUseCase(repo, hasher),
      inject: [USUARIO_REPOSITORY, PASSWORD_HASHER],
    },
    {
      provide: ActualizarUsuarioUseCase,
      useFactory: (repo: UsuarioRepository, hasher: PasswordHasher) =>
        new ActualizarUsuarioUseCase(repo, hasher),
      inject: [USUARIO_REPOSITORY, PASSWORD_HASHER],
    },
  ],
})
export class UsuariosModule {}
