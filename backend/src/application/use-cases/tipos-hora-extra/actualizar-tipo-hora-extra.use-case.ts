import { TipoHoraExtra } from '../../../domain/entities/tipo-hora-extra.entity';
import { TipoHoraExtraNoEncontradoError } from '../../../domain/errors/tipo-hora-extra-no-encontrado.error';
import {
  ActualizarTipoHoraExtraDatos,
  TipoHoraExtraRepository,
} from '../../ports/tipo-hora-extra.repository.port';

export class ActualizarTipoHoraExtraUseCase {
  constructor(private readonly repository: TipoHoraExtraRepository) {}

  async ejecutar(
    id: string,
    datos: ActualizarTipoHoraExtraDatos,
  ): Promise<TipoHoraExtra> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) {
      throw new TipoHoraExtraNoEncontradoError(id);
    }
    return this.repository.actualizar(id, datos);
  }
}
