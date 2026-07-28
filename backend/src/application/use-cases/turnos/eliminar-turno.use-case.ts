import { Turno } from '../../../domain/entities/turno.entity';
import { TurnoConAsignacionesError } from '../../../domain/errors/turno-con-asignaciones.error';
import { TurnoNoEncontradoError } from '../../../domain/errors/turno-no-encontrado.error';
import { TurnoPorDefectoNoEliminableError } from '../../../domain/errors/turno-por-defecto-no-eliminable.error';
import {
  CODIGO_TURNO_DIURNO,
  CODIGO_TURNO_SABADO,
} from '../asignaciones-turno/resolver-turno-del-empleado.use-case';
import { AsignacionTurnoRepository } from '../../ports/asignacion-turno.repository.port';
import { TurnoRepository } from '../../ports/turno.repository.port';

const CODIGOS_POR_DEFECTO = new Set([CODIGO_TURNO_DIURNO, CODIGO_TURNO_SABADO]);

export class EliminarTurnoUseCase {
  constructor(
    private readonly turnoRepository: TurnoRepository,
    private readonly asignacionRepository: AsignacionTurnoRepository,
  ) {}

  async ejecutar(id: string): Promise<Turno> {
    const turno = await this.turnoRepository.buscarPorId(id);
    if (!turno) {
      throw new TurnoNoEncontradoError(id);
    }
    if (CODIGOS_POR_DEFECTO.has(turno.codigo)) {
      throw new TurnoPorDefectoNoEliminableError(turno.codigo);
    }

    const tieneAsignaciones = await this.asignacionRepository.existeAlgunaConTurno(
      id,
    );
    if (tieneAsignaciones) {
      throw new TurnoConAsignacionesError(id);
    }

    await this.turnoRepository.eliminar(id);
    return turno;
  }
}
