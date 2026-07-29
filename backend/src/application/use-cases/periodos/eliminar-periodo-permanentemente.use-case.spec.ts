import { Periodo } from '../../../domain/entities/periodo.entity';
import { EstadoPeriodo } from '../../../domain/enums/estado-periodo.enum';
import { PeriodoNoEliminadoError } from '../../../domain/errors/periodo-no-eliminado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import {
  CrearPeriodoDatos,
  PeriodoRepository,
} from '../../ports/periodo.repository.port';
import { EliminarPeriodoPermanentementeUseCase } from './eliminar-periodo-permanentemente.use-case';

class PeriodoRepositoryFake implements PeriodoRepository {
  borradosPermanentemente: string[] = [];

  constructor(private periodos: Periodo[] = []) {}

  listar(): Promise<Periodo[]> {
    return Promise.resolve(this.periodos.filter((p) => !p.estaEliminado()));
  }

  listarEliminados(): Promise<Periodo[]> {
    return Promise.resolve(this.periodos.filter((p) => p.estaEliminado()));
  }

  buscarPorId(id: string): Promise<Periodo | null> {
    return Promise.resolve(this.periodos.find((p) => p.id === id) ?? null);
  }

  buscarPorFechas(): Promise<Periodo | null> {
    return Promise.resolve(null);
  }

  crear(_datos: CrearPeriodoDatos): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }

  cerrar(): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }

  eliminar(): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }

  restaurar(): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }

  eliminarPermanentemente(id: string): Promise<void> {
    this.borradosPermanentemente.push(id);
    this.periodos = this.periodos.filter((p) => p.id !== id);
    return Promise.resolve();
  }
}

const PERIODO_EN_PAPELERA = new Periodo(
  'periodo-1',
  new Date('2026-06-16'),
  new Date('2026-06-30'),
  EstadoPeriodo.ABIERTO,
  null,
  null,
  new Date('2026-07-28'),
  'usuario-0',
);

const PERIODO_ACTIVO = new Periodo(
  'periodo-2',
  new Date('2026-08-01'),
  new Date('2026-08-15'),
  EstadoPeriodo.ABIERTO,
  null,
  null,
  null,
  null,
);

describe('EliminarPeriodoPermanentementeUseCase', () => {
  it('borra físicamente un periodo que ya está en la papelera', async () => {
    const repo = new PeriodoRepositoryFake([PERIODO_EN_PAPELERA]);
    const useCase = new EliminarPeriodoPermanentementeUseCase(repo);

    const resultado = await useCase.ejecutar(PERIODO_EN_PAPELERA.id);

    expect(repo.borradosPermanentemente).toEqual([PERIODO_EN_PAPELERA.id]);
    expect(resultado.id).toBe(PERIODO_EN_PAPELERA.id);
  });

  it('lanza PeriodoNoEncontradoError si el periodo no existe', async () => {
    const useCase = new EliminarPeriodoPermanentementeUseCase(
      new PeriodoRepositoryFake([]),
    );

    await expect(useCase.ejecutar('inexistente')).rejects.toBeInstanceOf(
      PeriodoNoEncontradoError,
    );
  });

  it('lanza PeriodoNoEliminadoError si el periodo no está en la papelera (nunca se hizo soft-delete)', async () => {
    const repo = new PeriodoRepositoryFake([PERIODO_ACTIVO]);
    const useCase = new EliminarPeriodoPermanentementeUseCase(repo);

    await expect(useCase.ejecutar(PERIODO_ACTIVO.id)).rejects.toBeInstanceOf(
      PeriodoNoEliminadoError,
    );
    expect(repo.borradosPermanentemente).toHaveLength(0);
  });
});
