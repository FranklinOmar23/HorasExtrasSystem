import { Turno } from '../../../domain/entities/turno.entity';
import { TurnoCodigoDuplicadoError } from '../../../domain/errors/turno-codigo-duplicado.error';
import {
  CrearTurnoDatos,
  TurnoRepository,
} from '../../ports/turno.repository.port';

export class CrearTurnoUseCase {
  constructor(private readonly repository: TurnoRepository) {}

  async ejecutar(datos: CrearTurnoDatos): Promise<Turno> {
    const existente = await this.repository.buscarPorCodigo(datos.codigo);
    if (existente) {
      throw new TurnoCodigoDuplicadoError(datos.codigo);
    }
    return this.repository.crear(datos);
  }
}
