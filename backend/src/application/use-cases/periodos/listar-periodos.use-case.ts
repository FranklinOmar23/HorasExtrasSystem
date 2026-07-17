import { Periodo } from '../../../domain/entities/periodo.entity';
import { PeriodoRepository } from '../../ports/periodo.repository.port';

export class ListarPeriodosUseCase {
  constructor(private readonly repository: PeriodoRepository) {}

  async ejecutar(): Promise<Periodo[]> {
    return this.repository.listar();
  }
}
