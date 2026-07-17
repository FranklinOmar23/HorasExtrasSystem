import { Usuario } from '../../../domain/entities/usuario.entity';
import { RolUsuario } from '../../../domain/enums/rol-usuario.enum';
import { UsuarioEmailDuplicadoError } from '../../../domain/errors/usuario-email-duplicado.error';
import { PasswordHasher } from '../../ports/password-hasher.port';
import {
  ActualizarUsuarioDatos,
  CrearUsuarioDatos,
  UsuarioRepository,
} from '../../ports/usuario.repository.port';
import { CrearUsuarioUseCase } from './crear-usuario.use-case';

class UsuarioRepositoryFake implements UsuarioRepository {
  usuarios: Usuario[] = [];

  listar(): Promise<Usuario[]> {
    return Promise.resolve(this.usuarios);
  }

  buscarPorEmail(email: string): Promise<Usuario | null> {
    return Promise.resolve(
      this.usuarios.find((u) => u.email === email) ?? null,
    );
  }

  buscarPorId(id: string): Promise<Usuario | null> {
    return Promise.resolve(this.usuarios.find((u) => u.id === id) ?? null);
  }

  crear(datos: CrearUsuarioDatos): Promise<Usuario> {
    const usuario = new Usuario(
      `usuario-${this.usuarios.length + 1}`,
      datos.nombre,
      datos.email,
      datos.passwordHash,
      datos.rol,
      true,
    );
    this.usuarios.push(usuario);
    return Promise.resolve(usuario);
  }

  actualizar(_id: string, _datos: ActualizarUsuarioDatos): Promise<Usuario> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

class PasswordHasherFake implements PasswordHasher {
  comparar(_plano: string, _hash: string): Promise<boolean> {
    return Promise.reject(new Error('no usado en este test'));
  }

  hashear(plano: string): Promise<string> {
    return Promise.resolve(`hash(${plano})`);
  }
}

describe('CrearUsuarioUseCase', () => {
  it('crea el usuario con la contraseña hasheada', async () => {
    const repo = new UsuarioRepositoryFake();
    const useCase = new CrearUsuarioUseCase(repo, new PasswordHasherFake());

    const usuario = await useCase.ejecutar({
      nombre: 'Ana Familia',
      email: 'ana@hartemania.com',
      password: 'contraseña123',
      rol: RolUsuario.RRHH,
    });

    expect(usuario.passwordHash).toBe('hash(contraseña123)');
    expect(repo.usuarios).toHaveLength(1);
  });

  it('lanza UsuarioEmailDuplicadoError si el email ya está en uso', async () => {
    const repo = new UsuarioRepositoryFake();
    const useCase = new CrearUsuarioUseCase(repo, new PasswordHasherFake());
    await useCase.ejecutar({
      nombre: 'Ana Familia',
      email: 'ana@hartemania.com',
      password: 'contraseña123',
      rol: RolUsuario.RRHH,
    });

    await expect(
      useCase.ejecutar({
        nombre: 'Otra Persona',
        email: 'ana@hartemania.com',
        password: 'otra-contraseña',
        rol: RolUsuario.ADMIN,
      }),
    ).rejects.toBeInstanceOf(UsuarioEmailDuplicadoError);
  });
});
