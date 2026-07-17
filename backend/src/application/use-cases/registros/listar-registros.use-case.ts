import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import {
  RegistroConCalculos,
  RegistroHorasRepository,
} from '../../ports/registro-horas.repository.port';

export class ListarRegistrosUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly registroHorasRepository: RegistroHorasRepository,
  ) {}

  async ejecutar(
    periodoId: string,
    empleadoId?: string,
  ): Promise<RegistroConCalculos[]> {
    const periodo = await this.periodoRepository.buscarPorId(periodoId);
    if (!periodo) {
      throw new PeriodoNoEncontradoError(periodoId);
    }
    return this.registroHorasRepository.listarPorPeriodo(periodoId, empleadoId);
  }
}
