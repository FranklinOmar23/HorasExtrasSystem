import { Periodo } from '../../../domain/entities/periodo.entity';
import { EstadoPeriodo } from '../../../domain/enums/estado-periodo.enum';
import { PeriodoCerradoError } from '../../../domain/errors/periodo-cerrado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import {
  CrearPeriodoDatos,
  PeriodoRepository,
} from '../../ports/periodo.repository.port';
import { CerrarPeriodoUseCase } from './cerrar-periodo.use-case';

class PeriodoRepositoryFake implements PeriodoRepository {
  constructor(private periodos: Periodo[] = []) {}

  listar(): Promise<Periodo[]> {
    return Promise.resolve(this.periodos);
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

  cerrar(id: string, cerradoPorId: string, cerradoEn: Date): Promise<Periodo> {
    const actual = this.periodos.find((p) => p.id === id);
    if (!actual) {
      return Promise.reject(new Error('no encontrado'));
    }
    const cerrado = new Periodo(
      actual.id,
      actual.fechaInicio,
      actual.fechaFin,
      EstadoPeriodo.CERRADO,
      cerradoEn,
      cerradoPorId,
    );
    this.periodos = this.periodos.map((p) => (p.id === id ? cerrado : p));
    return Promise.resolve(cerrado);
  }
}

const PERIODO_ABIERTO = new Periodo(
  'periodo-1',
  new Date('2026-08-01'),
  new Date('2026-08-15'),
  EstadoPeriodo.ABIERTO,
  null,
  null,
);

describe('CerrarPeriodoUseCase', () => {
  it('cierra un periodo abierto y registra quién lo cerró', async () => {
    const useCase = new CerrarPeriodoUseCase(
      new PeriodoRepositoryFake([PERIODO_ABIERTO]),
    );

    const cerrado = await useCase.ejecutar(PERIODO_ABIERTO.id, 'usuario-1');

    expect(cerrado.estaCerrado()).toBe(true);
    expect(cerrado.cerradoPorId).toBe('usuario-1');
  });

  it('lanza PeriodoNoEncontradoError si el periodo no existe', async () => {
    const useCase = new CerrarPeriodoUseCase(new PeriodoRepositoryFake([]));

    await expect(
      useCase.ejecutar('inexistente', 'usuario-1'),
    ).rejects.toBeInstanceOf(PeriodoNoEncontradoError);
  });

  it('lanza PeriodoCerradoError si el periodo ya está cerrado', async () => {
    const yaCerrado = new Periodo(
      'periodo-2',
      new Date('2026-08-01'),
      new Date('2026-08-15'),
      EstadoPeriodo.CERRADO,
      new Date('2026-08-16'),
      'usuario-0',
    );
    const useCase = new CerrarPeriodoUseCase(
      new PeriodoRepositoryFake([yaCerrado]),
    );

    await expect(
      useCase.ejecutar(yaCerrado.id, 'usuario-1'),
    ).rejects.toBeInstanceOf(PeriodoCerradoError);
  });
});
