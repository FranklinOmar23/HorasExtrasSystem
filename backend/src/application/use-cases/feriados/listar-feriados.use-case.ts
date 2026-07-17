import { Feriado } from '../../../domain/entities/feriado.entity';
import { FeriadoRepository } from '../../ports/feriado.repository.port';

export class ListarFeriadosUseCase {
  constructor(private readonly repository: FeriadoRepository) {}

  async ejecutar(anio?: number): Promise<Feriado[]> {
    return this.repository.listar(anio);
  }
}
