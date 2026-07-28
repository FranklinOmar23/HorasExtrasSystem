import { AsignacionTurno } from '../../../domain/entities/asignacion-turno.entity';
import { AsignacionTurnoNoEncontradaError } from '../../../domain/errors/asignacion-turno-no-encontrada.error';
import { AsignacionTurnoRepository } from '../../ports/asignacion-turno.repository.port';
import { RecalcularRegistrosPorCambioDeTurnoService } from '../../services/recalcular-registros-turno.service';

export class EliminarAsignacionTurnoUseCase {
  constructor(
    private readonly repository: AsignacionTurnoRepository,
    private readonly recalcularService: RecalcularRegistrosPorCambioDeTurnoService,
  ) {}

  async ejecutar(id: string): Promise<AsignacionTurno> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) {
      throw new AsignacionTurnoNoEncontradaError(id);
    }

    await this.recalcularService.verificarPeriodosAbiertos(
      existente.empleadoId,
      existente.fechaDesde,
      existente.fechaHasta,
    );

    await this.repository.eliminar(id);

    await this.recalcularService.recalcular(
      existente.empleadoId,
      existente.fechaDesde,
      existente.fechaHasta,
    );

    return existente;
  }
}
