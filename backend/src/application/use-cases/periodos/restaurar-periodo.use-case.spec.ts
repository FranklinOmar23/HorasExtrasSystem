import { Periodo } from '../../../domain/entities/periodo.entity';
import { EstadoPeriodo } from '../../../domain/enums/estado-periodo.enum';
import { PeriodoNoEliminadoError } from '../../../domain/errors/periodo-no-eliminado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { PeriodoRestauracionExpiradaError } from '../../../domain/errors/periodo-restauracion-expirada.error';
import {
  CrearPeriodoDatos,
  PeriodoRepository,
} from '../../ports/periodo.repository.port';
import { RestaurarPeriodoUseCase } from './restaurar-periodo.use-case';

class PeriodoRepositoryFake implements PeriodoRepository {
  restaurados: string[] = [];

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

  restaurar(id: string): Promise<Periodo> {
    this.restaurados.push(id);
    const actual = this.periodos.find((p) => p.id === id) as Periodo;
    const restaurado = new Periodo(
      actual.id,
      actual.fechaInicio,
      actual.fechaFin,
      actual.estado,
      actual.cerradoEn,
      actual.cerradoPorId,
      null,
      null,
    );
    this.periodos = this.periodos.map((p) => (p.id === id ? restaurado : p));
    return Promise.resolve(restaurado);
  }

  eliminarPermanentemente(): Promise<void> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

function diasAntes(dias: number): Date {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return fecha;
}

const PERIODO_ELIMINADO_RECIENTE = new Periodo(
  'periodo-1',
  new Date('2026-06-01'),
  new Date('2026-06-15'),
  EstadoPeriodo.ABIERTO,
  null,
  null,
  diasAntes(5),
  'usuario-0',
);

const PERIODO_ABIERTO = new Periodo(
  'periodo-2',
  new Date('2026-08-01'),
  new Date('2026-08-15'),
  EstadoPeriodo.ABIERTO,
  null,
  null,
  null,
  null,
);

const PERIODO_ELIMINADO_EXPIRADO = new Periodo(
  'periodo-3',
  new Date('2026-05-01'),
  new Date('2026-05-15'),
  EstadoPeriodo.ABIERTO,
  null,
  null,
  diasAntes(31),
  'usuario-0',
);

describe('RestaurarPeriodoUseCase', () => {
  it('restaura un periodo eliminado dentro de los 30 días', async () => {
    const repo = new PeriodoRepositoryFake([PERIODO_ELIMINADO_RECIENTE]);
    const useCase = new RestaurarPeriodoUseCase(repo);

    const restaurado = await useCase.ejecutar(PERIODO_ELIMINADO_RECIENTE.id);

    expect(repo.restaurados).toEqual([PERIODO_ELIMINADO_RECIENTE.id]);
    expect(restaurado.estaEliminado()).toBe(false);
  });

  it('lanza PeriodoNoEncontradoError si el periodo no existe', async () => {
    const useCase = new RestaurarPeriodoUseCase(new PeriodoRepositoryFake([]));

    await expect(useCase.ejecutar('inexistente')).rejects.toBeInstanceOf(
      PeriodoNoEncontradoError,
    );
  });

  it('lanza PeriodoNoEliminadoError si el periodo no está eliminado', async () => {
    const useCase = new RestaurarPeriodoUseCase(
      new PeriodoRepositoryFake([PERIODO_ABIERTO]),
    );

    await expect(useCase.ejecutar(PERIODO_ABIERTO.id)).rejects.toBeInstanceOf(
      PeriodoNoEliminadoError,
    );
  });

  it('lanza PeriodoRestauracionExpiradaError si pasaron más de 30 días', async () => {
    const useCase = new RestaurarPeriodoUseCase(
      new PeriodoRepositoryFake([PERIODO_ELIMINADO_EXPIRADO]),
    );

    await expect(
      useCase.ejecutar(PERIODO_ELIMINADO_EXPIRADO.id),
    ).rejects.toBeInstanceOf(PeriodoRestauracionExpiradaError);
  });
});
