import { AsignacionTurno } from '../../../domain/entities/asignacion-turno.entity';
import { AsignacionRangoFechasInvalidoError } from '../../../domain/errors/asignacion-rango-fechas-invalido.error';
import { AsignacionSolapadaError } from '../../../domain/errors/asignacion-solapada.error';
import { EmpleadoNoEncontradoError } from '../../../domain/errors/empleado-no-encontrado.error';
import { TurnoNoEncontradoError } from '../../../domain/errors/turno-no-encontrado.error';
import { rangosDeFechasSeSolapan } from '../../../domain/services/rango-fechas.util';
import {
  AsignacionTurnoRepository,
  CrearAsignacionTurnoDatos,
} from '../../ports/asignacion-turno.repository.port';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
import { TurnoRepository } from '../../ports/turno.repository.port';
import { RecalcularRegistrosPorCambioDeTurnoService } from '../../services/recalcular-registros-turno.service';

/**
 * Una asignación nueva puede cubrir fechas que ya tienen registros de horas
 * calculados con el turno anterior (ej. asignar NOCTURNO retroactivo a un
 * rango ya trabajado): por eso también verifica periodos cerrados y
 * recalcula, igual que actualizar/eliminar.
 */
export class CrearAsignacionTurnoUseCase {
  constructor(
    private readonly empleadoRepository: EmpleadoRepository,
    private readonly turnoRepository: TurnoRepository,
    private readonly asignacionRepository: AsignacionTurnoRepository,
    private readonly recalcularService: RecalcularRegistrosPorCambioDeTurnoService,
  ) {}

  async ejecutar(datos: CrearAsignacionTurnoDatos): Promise<AsignacionTurno> {
    const empleado = await this.empleadoRepository.buscarPorId(
      datos.empleadoId,
    );
    if (!empleado) {
      throw new EmpleadoNoEncontradoError(datos.empleadoId);
    }

    const turno = await this.turnoRepository.buscarPorId(datos.turnoId);
    if (!turno) {
      throw new TurnoNoEncontradoError(datos.turnoId);
    }

    if (datos.fechaHasta !== null && datos.fechaHasta < datos.fechaDesde) {
      throw new AsignacionRangoFechasInvalidoError();
    }

    const existentes = await this.asignacionRepository.listarPorEmpleado(
      datos.empleadoId,
    );
    const seSolapa = existentes.some((a) =>
      rangosDeFechasSeSolapan(
        a.fechaDesde,
        a.fechaHasta,
        datos.fechaDesde,
        datos.fechaHasta,
      ),
    );
    if (seSolapa) {
      throw new AsignacionSolapadaError(datos.empleadoId);
    }

    await this.recalcularService.verificarPeriodosAbiertos(
      datos.empleadoId,
      datos.fechaDesde,
      datos.fechaHasta,
    );

    const asignacion = await this.asignacionRepository.crear(datos);

    await this.recalcularService.recalcular(
      datos.empleadoId,
      datos.fechaDesde,
      datos.fechaHasta,
    );

    return asignacion;
  }
}
