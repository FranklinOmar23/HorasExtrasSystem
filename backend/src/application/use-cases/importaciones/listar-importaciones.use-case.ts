import { Importacion } from '../../../domain/entities/importacion.entity';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { ImportacionRepository } from '../../ports/importacion.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';

export class ListarImportacionesUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly importacionRepository: ImportacionRepository,
  ) {}

  async ejecutar(periodoId: string): Promise<Importacion[]> {
    const periodo = await this.periodoRepository.buscarPorId(periodoId);
    if (!periodo) {
      throw new PeriodoNoEncontradoError(periodoId);
    }
    return this.importacionRepository.listarPorPeriodo(periodoId);
  }
}
