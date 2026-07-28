import { PeriodoCerradoError } from '../../domain/errors/periodo-cerrado.error';
import { PeriodoRepository } from '../ports/periodo.repository.port';
import { RegistroHorasRepository } from '../ports/registro-horas.repository.port';
import { CalcularDesgloseService } from './calcular-desglose.service';

/**
 * Cuando se crea, edita o borra una AsignacionTurno, los `calculos` ya
 * persistidos de los registros de horas dentro de su rango de fechas pueden
 * haber quedado desactualizados (se calcularon con el turno vigente en ese
 * momento, que ya no es el mismo). Este servicio verifica que ningún
 * registro afectado esté en un periodo CERRADO (en cuyo caso la operación de
 * turno se rechaza, sin persistir nada) y, si la asignación ya se persistió,
 * recalcula esos registros con el turno actualizado.
 */
export class RecalcularRegistrosPorCambioDeTurnoService {
  constructor(
    private readonly registroHorasRepository: RegistroHorasRepository,
    private readonly periodoRepository: PeriodoRepository,
    private readonly calcularDesglose: CalcularDesgloseService,
  ) {}

  /** Lanza PeriodoCerradoError si algún registro afectado por el rango cae
   *  en un periodo cerrado. Se llama ANTES de persistir el cambio de
   *  asignación, para no mutar nada si la operación no se puede completar. */
  async verificarPeriodosAbiertos(
    empleadoId: string,
    desde: Date,
    hasta: Date | null,
  ): Promise<void> {
    const registros = await this.registroHorasRepository.listarPorEmpleadoYRango(
      empleadoId,
      desde,
      hasta,
    );
    const periodoIds = [...new Set(registros.map((r) => r.registro.periodoId))];
    for (const periodoId of periodoIds) {
      const periodo = await this.periodoRepository.buscarPorId(periodoId);
      if (periodo?.estaCerrado()) {
        throw new PeriodoCerradoError(periodoId);
      }
    }
  }

  /** Se llama DESPUÉS de persistir el cambio de asignación: recalcula los
   *  `calculos` de cada registro afectado con el turno ya actualizado. */
  async recalcular(
    empleadoId: string,
    desde: Date,
    hasta: Date | null,
  ): Promise<void> {
    const registros = await this.registroHorasRepository.listarPorEmpleadoYRango(
      empleadoId,
      desde,
      hasta,
    );
    for (const { registro } of registros) {
      const filas = await this.calcularDesglose.calcular(
        empleadoId,
        registro.fecha,
        registro.horaEntrada,
        registro.horaSalida,
      );
      await this.registroHorasRepository.actualizar(
        registro.id,
        {
          fecha: registro.fecha,
          horaEntrada: registro.horaEntrada,
          horaSalida: registro.horaSalida,
          comentario: registro.comentario,
        },
        filas,
      );
    }
  }
}
