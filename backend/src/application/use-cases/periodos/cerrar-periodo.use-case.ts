import { Periodo } from '../../../domain/entities/periodo.entity';
import { PeriodoCerradoError } from '../../../domain/errors/periodo-cerrado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { PeriodoRepository } from '../../ports/periodo.repository.port';

export class CerrarPeriodoUseCase {
  constructor(private readonly repository: PeriodoRepository) {}

  async ejecutar(id: string, cerradoPorId: string): Promise<Periodo> {
    const periodo = await this.repository.buscarPorId(id);
    if (!periodo) {
      throw new PeriodoNoEncontradoError(id);
    }
    if (periodo.estaCerrado()) {
      throw new PeriodoCerradoError(id);
    }

    return this.repository.cerrar(id, cerradoPorId, new Date());
  }
}
