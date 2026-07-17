import { FeriadoNoEncontradoError } from '../../../domain/errors/feriado-no-encontrado.error';
import { FeriadoRepository } from '../../ports/feriado.repository.port';

export class EliminarFeriadoUseCase {
  constructor(private readonly repository: FeriadoRepository) {}

  async ejecutar(id: string): Promise<void> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) {
      throw new FeriadoNoEncontradoError(id);
    }
    await this.repository.eliminar(id);
  }
}
