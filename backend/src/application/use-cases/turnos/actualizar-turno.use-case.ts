import { Turno } from '../../../domain/entities/turno.entity';
import { TurnoNoEncontradoError } from '../../../domain/errors/turno-no-encontrado.error';
import {
  ActualizarTurnoDatos,
  TurnoRepository,
} from '../../ports/turno.repository.port';

export class ActualizarTurnoUseCase {
  constructor(private readonly repository: TurnoRepository) {}

  async ejecutar(id: string, datos: ActualizarTurnoDatos): Promise<Turno> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) {
      throw new TurnoNoEncontradoError(id);
    }
    return this.repository.actualizar(id, datos);
  }
}
