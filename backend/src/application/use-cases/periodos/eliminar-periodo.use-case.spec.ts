import { Periodo } from '../../../domain/entities/periodo.entity';
import { EstadoPeriodo } from '../../../domain/enums/estado-periodo.enum';
import { PeriodoCerradoError } from '../../../domain/errors/periodo-cerrado.error';
import { PeriodoEliminadoError } from '../../../domain/errors/periodo-eliminado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import {
  CrearPeriodoDatos,
  PeriodoRepository,
} from '../../ports/periodo.repository.port';
import { EliminarPeriodoUseCase } from './eliminar-periodo.use-case';

class PeriodoRepositoryFake implements PeriodoRepository {
  eliminados: string[] = [];

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

  eliminar(
    id: string,
    eliminadoPorId: string,
    eliminadoEn: Date,
  ): Promise<Periodo> {
    this.eliminados.push(id);
    const actual = this.periodos.find((p) => p.id === id) as Periodo;
    const eliminado = new Periodo(
      actual.id,
      actual.fechaInicio,
      actual.fechaFin,
      actual.estado,
      actual.cerradoEn,
      actual.cerradoPorId,
      eliminadoEn,
      eliminadoPorId,
    );
    this.periodos = this.periodos.map((p) => (p.id === id ? eliminado : p));
    return Promise.resolve(eliminado);
  }

  restaurar(): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

const PERIODO_ABIERTO = new Periodo(
  'periodo-1',
  new Date('2026-08-01'),
  new Date('2026-08-15'),
  EstadoPeriodo.ABIERTO,
  null,
  null,
  null,
  null,
);

describe('EliminarPeriodoUseCase', () => {
  it('elimina (soft-delete) un periodo abierto', async () => {
    const repo = new PeriodoRepositoryFake([PERIODO_ABIERTO]);
    const useCase = new EliminarPeriodoUseCase(repo);

    const eliminado = await useCase.ejecutar(PERIODO_ABIERTO.id, 'usuario-1');

    expect(repo.eliminados).toEqual([PERIODO_ABIERTO.id]);
    expect(eliminado.estaEliminado()).toBe(true);
    expect(eliminado.eliminadoPorId).toBe('usuario-1');
  });

  it('lanza PeriodoNoEncontradoError si el periodo no existe', async () => {
    const useCase = new EliminarPeriodoUseCase(new PeriodoRepositoryFake([]));

    await expect(useCase.ejecutar('inexistente', 'usuario-1')).rejects.toBeInstanceOf(
      PeriodoNoEncontradoError,
    );
  });

  it('lanza PeriodoCerradoError si el periodo está cerrado', async () => {
    const cerrado = new Periodo(
      'periodo-2',
      new Date('2026-08-01'),
      new Date('2026-08-15'),
      EstadoPeriodo.CERRADO,
      new Date('2026-08-16'),
      'usuario-0',
      null,
      null,
    );
    const useCase = new EliminarPeriodoUseCase(
      new PeriodoRepositoryFake([cerrado]),
    );

    await expect(useCase.ejecutar(cerrado.id, 'usuario-1')).rejects.toBeInstanceOf(
      PeriodoCerradoError,
    );
  });

  it('lanza PeriodoEliminadoError si el periodo ya estaba eliminado', async () => {
    const yaEliminado = new Periodo(
      'periodo-3',
      new Date('2026-08-01'),
      new Date('2026-08-15'),
      EstadoPeriodo.ABIERTO,
      null,
      null,
      new Date('2026-08-16'),
      'usuario-0',
    );
    const useCase = new EliminarPeriodoUseCase(
      new PeriodoRepositoryFake([yaEliminado]),
    );

    await expect(useCase.ejecutar(yaEliminado.id, 'usuario-1')).rejects.toBeInstanceOf(
      PeriodoEliminadoError,
    );
  });
});
