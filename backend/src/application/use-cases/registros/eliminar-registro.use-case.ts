import { PeriodoCerradoError } from '../../../domain/errors/periodo-cerrado.error';
import { PeriodoEliminadoError } from '../../../domain/errors/periodo-eliminado.error';
import { RegistroHorasNoEncontradoError } from '../../../domain/errors/registro-horas-no-encontrado.error';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import {
  RegistroConCalculos,
  RegistroHorasRepository,
} from '../../ports/registro-horas.repository.port';

export class EliminarRegistroUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly registroHorasRepository: RegistroHorasRepository,
  ) {}

  async ejecutar(id: string): Promise<RegistroConCalculos> {
    const existente = await this.registroHorasRepository.buscarPorId(id);
    if (!existente) {
      throw new RegistroHorasNoEncontradoError(id);
    }

    const periodo = await this.periodoRepository.buscarPorId(
      existente.registro.periodoId,
    );
    if (periodo?.estaEliminado()) {
      throw new PeriodoEliminadoError(existente.registro.periodoId);
    }
    if (periodo?.estaCerrado()) {
      throw new PeriodoCerradoError(existente.registro.periodoId);
    }

    await this.registroHorasRepository.eliminar(id);
    return existente;
  }
}
