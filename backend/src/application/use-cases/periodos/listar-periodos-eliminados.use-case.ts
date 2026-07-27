import { Periodo } from '../../../domain/entities/periodo.entity';
import { PeriodoRepository } from '../../ports/periodo.repository.port';

export class ListarPeriodosEliminadosUseCase {
  constructor(private readonly repository: PeriodoRepository) {}

  async ejecutar(): Promise<Periodo[]> {
    return this.repository.listarEliminados();
  }
}
