import { AsignacionTurno } from '../../../domain/entities/asignacion-turno.entity';
import { AsignacionRangoFechasInvalidoError } from '../../../domain/errors/asignacion-rango-fechas-invalido.error';
import { AsignacionSolapadaError } from '../../../domain/errors/asignacion-solapada.error';
import { AsignacionTurnoNoEncontradaError } from '../../../domain/errors/asignacion-turno-no-encontrada.error';
import { TurnoNoEncontradoError } from '../../../domain/errors/turno-no-encontrado.error';
import {
  rangosDeFechasSeSolapan,
  unionDeRangos,
} from '../../../domain/services/rango-fechas.util';
import {
  ActualizarAsignacionTurnoDatos,
  AsignacionTurnoRepository,
} from '../../ports/asignacion-turno.repository.port';
import { TurnoRepository } from '../../ports/turno.repository.port';
import { RecalcularRegistrosPorCambioDeTurnoService } from '../../services/recalcular-registros-turno.service';

export class ActualizarAsignacionTurnoUseCase {
  constructor(
    private readonly turnoRepository: TurnoRepository,
    private readonly asignacionRepository: AsignacionTurnoRepository,
    private readonly recalcularService: RecalcularRegistrosPorCambioDeTurnoService,
  ) {}

  async ejecutar(
    id: string,
    datos: ActualizarAsignacionTurnoDatos,
  ): Promise<AsignacionTurno> {
    const existente = await this.asignacionRepository.buscarPorId(id);
    if (!existente) {
      throw new AsignacionTurnoNoEncontradaError(id);
    }

    if (datos.turnoId) {
      const turno = await this.turnoRepository.buscarPorId(datos.turnoId);
      if (!turno) {
        throw new TurnoNoEncontradoError(datos.turnoId);
      }
    }

    const fechaDesde = datos.fechaDesde ?? existente.fechaDesde;
    const fechaHasta =
      datos.fechaHasta !== undefined ? datos.fechaHasta : existente.fechaHasta;
    if (fechaHasta !== null && fechaHasta < fechaDesde) {
      throw new AsignacionRangoFechasInvalidoError();
    }

    const otras = (
      await this.asignacionRepository.listarPorEmpleado(existente.empleadoId)
    ).filter((a) => a.id !== id);
    const seSolapa = otras.some((a) =>
      rangosDeFechasSeSolapan(a.fechaDesde, a.fechaHasta, fechaDesde, fechaHasta),
    );
    if (seSolapa) {
      throw new AsignacionSolapadaError(existente.empleadoId);
    }

    // El rango afectado es la unión del viejo y el nuevo: si se acorta o se
    // mueve, hay que recalcular tanto lo que dejó de estar cubierto como lo
    // que ahora queda cubierto.
    const rango = unionDeRangos(
      existente.fechaDesde,
      existente.fechaHasta,
      fechaDesde,
      fechaHasta,
    );
    await this.recalcularService.verificarPeriodosAbiertos(
      existente.empleadoId,
      rango.desde,
      rango.hasta,
    );

    const actualizada = await this.asignacionRepository.actualizar(id, {
      ...datos,
      fechaDesde,
      fechaHasta,
    });

    await this.recalcularService.recalcular(
      existente.empleadoId,
      rango.desde,
      rango.hasta,
    );

    return actualizada;
  }
}
