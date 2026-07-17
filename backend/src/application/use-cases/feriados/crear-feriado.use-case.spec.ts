import { Feriado } from '../../../domain/entities/feriado.entity';
import { FeriadoFechaDuplicadaError } from '../../../domain/errors/feriado-fecha-duplicada.error';
import {
  CrearFeriadoDatos,
  FeriadoRepository,
} from '../../ports/feriado.repository.port';
import { CrearFeriadoUseCase } from './crear-feriado.use-case';

class FeriadoRepositoryFake implements FeriadoRepository {
  feriados: Feriado[] = [];

  listar(_anio?: number): Promise<Feriado[]> {
    return Promise.resolve(this.feriados);
  }

  buscarPorId(id: string): Promise<Feriado | null> {
    return Promise.resolve(this.feriados.find((f) => f.id === id) ?? null);
  }

  buscarPorFecha(fecha: Date): Promise<Feriado | null> {
    return Promise.resolve(
      this.feriados.find((f) => f.fecha.getTime() === fecha.getTime()) ?? null,
    );
  }

  crear(datos: CrearFeriadoDatos): Promise<Feriado> {
    const feriado = new Feriado(
      `id-${this.feriados.length + 1}`,
      datos.fecha,
      datos.descripcion,
    );
    this.feriados.push(feriado);
    return Promise.resolve(feriado);
  }

  eliminar(id: string): Promise<void> {
    this.feriados = this.feriados.filter((f) => f.id !== id);
    return Promise.resolve();
  }
}

describe('CrearFeriadoUseCase', () => {
  it('crea el feriado cuando la fecha no está registrada', async () => {
    const repo = new FeriadoRepositoryFake();
    const useCase = new CrearFeriadoUseCase(repo);

    const feriado = await useCase.ejecutar({
      fecha: new Date('2026-02-27'),
      descripcion: 'Día de la Independencia',
    });

    expect(feriado.descripcion).toBe('Día de la Independencia');
    expect(repo.feriados).toHaveLength(1);
  });

  it('lanza FeriadoFechaDuplicadaError si ya existe un feriado en esa fecha', async () => {
    const repo = new FeriadoRepositoryFake();
    const useCase = new CrearFeriadoUseCase(repo);
    await useCase.ejecutar({
      fecha: new Date('2026-02-27'),
      descripcion: 'Día de la Independencia',
    });

    await expect(
      useCase.ejecutar({
        fecha: new Date('2026-02-27'),
        descripcion: 'Otro nombre',
      }),
    ).rejects.toBeInstanceOf(FeriadoFechaDuplicadaError);
  });
});
