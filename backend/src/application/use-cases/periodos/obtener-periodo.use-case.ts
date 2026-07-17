import { Periodo } from '../../../domain/entities/periodo.entity';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { PeriodoRepository } from '../../ports/periodo.repository.port';

export class ObtenerPeriodoUseCase {
  constructor(private readonly repository: PeriodoRepository) {}

  async ejecutar(id: string): Promise<Periodo> {
    const periodo = await this.repository.buscarPorId(id);
    if (!periodo) {
      throw new PeriodoNoEncontradoError(id);
    }
    return periodo;
  }
}
