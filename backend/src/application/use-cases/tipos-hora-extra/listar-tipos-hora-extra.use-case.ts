import { TipoHoraExtra } from '../../../domain/entities/tipo-hora-extra.entity';
import { TipoHoraExtraRepository } from '../../ports/tipo-hora-extra.repository.port';

export class ListarTiposHoraExtraUseCase {
  constructor(private readonly repository: TipoHoraExtraRepository) {}

  async ejecutar(): Promise<TipoHoraExtra[]> {
    return this.repository.listar();
  }
}
