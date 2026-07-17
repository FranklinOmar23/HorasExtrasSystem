import { Usuario } from '../../../domain/entities/usuario.entity';
import { RolUsuario } from '../../../domain/enums/rol-usuario.enum';
import { UsuarioNoEncontradoError } from '../../../domain/errors/usuario-no-encontrado.error';
import { PasswordHasher } from '../../ports/password-hasher.port';
import {
  ActualizarUsuarioDatos,
  CrearUsuarioDatos,
  UsuarioRepository,
} from '../../ports/usuario.repository.port';
import { ActualizarUsuarioUseCase } from './actualizar-usuario.use-case';

class UsuarioRepositoryFake implements UsuarioRepository {
  constructor(private readonly usuarios: Usuario[]) {}
  llamadasActualizar: { id: string; datos: ActualizarUsuarioDatos }[] = [];

  listar(): Promise<Usuario[]> {
    return Promise.resolve(this.usuarios);
  }

  buscarPorEmail(): Promise<Usuario | null> {
    return Promise.resolve(null);
  }

  buscarPorId(id: string): Promise<Usuario | null> {
    return Promise.resolve(this.usuarios.find((u) => u.id === id) ?? null);
  }

  crear(_datos: CrearUsuarioDatos): Promise<Usuario> {
    return Promise.reject(new Error('no usado en este test'));
  }

  actualizar(id: string, datos: ActualizarUsuarioDatos): Promise<Usuario> {
    this.llamadasActualizar.push({ id, datos });
    const actual = this.usuarios.find((u) => u.id === id);
    if (!actual) {
      return Promise.reject(new Error('usuario no encontrado en el fake'));
    }
    return Promise.resolve(
      new Usuario(
        actual.id,
        datos.nombre ?? actual.nombre,
        actual.email,
        datos.passwordHash ?? actual.passwordHash,
        datos.rol ?? actual.rol,
        datos.activo ?? actual.activo,
      ),
    );
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

const USUARIO = new Usuario(
  'usuario-1',
  'Ana Familia',
  'ana@hartemania.com',
  'hash-anterior',
  RolUsuario.RRHH,
  true,
);

describe('ActualizarUsuarioUseCase', () => {
  it('lanza UsuarioNoEncontradoError si el usuario no existe', async () => {
    const useCase = new ActualizarUsuarioUseCase(
      new UsuarioRepositoryFake([]),
      new PasswordHasherFake(),
    );

    await expect(
      useCase.ejecutar('no-existe', { activo: false }),
    ).rejects.toBeInstanceOf(UsuarioNoEncontradoError);
  });

  it('actualiza campos simples sin tocar la contraseña si no se envía', async () => {
    const repo = new UsuarioRepositoryFake([USUARIO]);
    const useCase = new ActualizarUsuarioUseCase(
      repo,
      new PasswordHasherFake(),
    );

    await useCase.ejecutar(USUARIO.id, { activo: false });

    expect(repo.llamadasActualizar[0].datos.passwordHash).toBeUndefined();
    expect(repo.llamadasActualizar[0].datos.activo).toBe(false);
  });

  it('hashea la nueva contraseña cuando se envía', async () => {
    const repo = new UsuarioRepositoryFake([USUARIO]);
    const useCase = new ActualizarUsuarioUseCase(
      repo,
      new PasswordHasherFake(),
    );

    await useCase.ejecutar(USUARIO.id, { password: 'nueva-contraseña' });

    expect(repo.llamadasActualizar[0].datos.passwordHash).toBe(
      'hash(nueva-contraseña)',
    );
  });
});
