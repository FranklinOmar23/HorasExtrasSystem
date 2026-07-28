import { Turno } from '../../../domain/entities/turno.entity';
import { TurnoRepository } from '../../ports/turno.repository.port';

export class ListarTurnosUseCase {
  constructor(private readonly repository: TurnoRepository) {}

  ejecutar(): Promise<Turno[]> {
    return this.repository.listar();
  }
}
