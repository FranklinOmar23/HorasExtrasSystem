import { Turno } from '../../../domain/entities/turno.entity';
import { TurnoNoEncontradoError } from '../../../domain/errors/turno-no-encontrado.error';
import { AsignacionTurnoRepository } from '../../ports/asignacion-turno.repository.port';
import { TurnoRepository } from '../../ports/turno.repository.port';

export const CODIGO_TURNO_DIURNO = 'DIURNO';
export const CODIGO_TURNO_SABADO = 'SABADO';

const DIA_SABADO = 6;

export interface ResolucionTurno {
  turno: Turno;
  /**
   * true si viene de una AsignacionTurno vigente (RRHH lo puso a propósito
   * ahí); false si es el turno por defecto (DIURNO/SABADO) porque no hay
   * ninguna asignación cubriendo la fecha. El motor de cálculo usa este dato
   * para decidir el mecanismo de exceso: con asignación explícita, el exceso
   * se mide por posición de reloj contra el inicio/fin de esa ventana; sin
   * asignación, se preserva el cálculo histórico (total de horas netas
   * contra el presupuesto del turno por defecto), para no alterar la nómina
   * de nadie que nunca fue asignado a un turno.
   */
  explicita: boolean;
}

/**
 * Resuelve qué turno aplica a un empleado en una fecha dada: la asignación
 * vigente si existe, o el turno por defecto (DIURNO, SABADO si la fecha cae
 * en sábado) en caso contrario.
 */
export class ResolverTurnoDelEmpleadoUseCase {
  constructor(
    private readonly turnoRepository: TurnoRepository,
    private readonly asignacionRepository: AsignacionTurnoRepository,
  ) {}

  async ejecutar(empleadoId: string, fecha: Date): Promise<ResolucionTurno> {
    const vigente = await this.asignacionRepository.buscarVigenteEn(
      empleadoId,
      fecha,
    );
    if (vigente) {
      const turno = await this.turnoRepository.buscarPorId(vigente.turnoId);
      if (!turno) {
        throw new TurnoNoEncontradoError(vigente.turnoId);
      }
      return { turno, explicita: true };
    }

    const codigoDefecto =
      fecha.getUTCDay() === DIA_SABADO ? CODIGO_TURNO_SABADO : CODIGO_TURNO_DIURNO;
    const turnoDefecto = await this.turnoRepository.buscarPorCodigo(
      codigoDefecto,
    );
    if (!turnoDefecto) {
      throw new TurnoNoEncontradoError(codigoDefecto);
    }
    return { turno: turnoDefecto, explicita: false };
  }
}
