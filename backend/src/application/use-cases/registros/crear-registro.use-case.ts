import { EmpleadoNoEncontradoError } from '../../../domain/errors/empleado-no-encontrado.error';
import { PeriodoCerradoError } from '../../../domain/errors/periodo-cerrado.error';
import { PeriodoEliminadoError } from '../../../domain/errors/periodo-eliminado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { OrigenRegistro } from '../../../domain/enums/origen-registro.enum';
import { CalcularDesgloseService } from '../../services/calcular-desglose.service';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import {
  RegistroConCalculos,
  RegistroHorasRepository,
} from '../../ports/registro-horas.repository.port';

export interface CrearRegistroComando {
  periodoId: string;
  empleadoId: string;
  fecha: Date;
  horaEntrada: string;
  horaSalida: string;
  comentario: string | null;
}

export class CrearRegistroUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly empleadoRepository: EmpleadoRepository,
    private readonly registroHorasRepository: RegistroHorasRepository,
    private readonly calcularDesglose: CalcularDesgloseService,
  ) {}

  async ejecutar(comando: CrearRegistroComando): Promise<RegistroConCalculos> {
    const periodo = await this.periodoRepository.buscarPorId(comando.periodoId);
    if (!periodo) {
      throw new PeriodoNoEncontradoError(comando.periodoId);
    }
    if (periodo.estaEliminado()) {
      throw new PeriodoEliminadoError(comando.periodoId);
    }
    if (periodo.estaCerrado()) {
      throw new PeriodoCerradoError(comando.periodoId);
    }

    const empleado = await this.empleadoRepository.buscarPorId(
      comando.empleadoId,
    );
    if (!empleado) {
      throw new EmpleadoNoEncontradoError(comando.empleadoId);
    }

    const filas = await this.calcularDesglose.calcular(
      comando.empleadoId,
      comando.fecha,
      comando.horaEntrada,
      comando.horaSalida,
    );

    return this.registroHorasRepository.crear(
      {
        periodoId: comando.periodoId,
        empleadoId: comando.empleadoId,
        fecha: comando.fecha,
        horaEntrada: comando.horaEntrada,
        horaSalida: comando.horaSalida,
        origen: OrigenRegistro.MANUAL,
        importacionId: null,
        comentario: comando.comentario,
      },
      filas,
    );
  }
}
