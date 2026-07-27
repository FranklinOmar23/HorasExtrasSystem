import { PeriodoCerradoError } from '../../../domain/errors/periodo-cerrado.error';
import { PeriodoEliminadoError } from '../../../domain/errors/periodo-eliminado.error';
import { RegistroHorasNoEncontradoError } from '../../../domain/errors/registro-horas-no-encontrado.error';
import { CalcularDesgloseService } from '../../services/calcular-desglose.service';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import {
  RegistroConCalculos,
  RegistroHorasRepository,
} from '../../ports/registro-horas.repository.port';

export interface ActualizarRegistroComando {
  fecha?: Date;
  horaEntrada?: string;
  horaSalida?: string;
  comentario?: string | null;
}

export class ActualizarRegistroUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly registroHorasRepository: RegistroHorasRepository,
    private readonly calcularDesglose: CalcularDesgloseService,
  ) {}

  async ejecutar(
    id: string,
    comando: ActualizarRegistroComando,
  ): Promise<RegistroConCalculos> {
    const existente = await this.registroHorasRepository.buscarPorId(id);
    if (!existente) {
      throw new RegistroHorasNoEncontradoError(id);
    }

    const periodo = await this.periodoRepository.buscarPorId(
      existente.registro.periodoId,
    );
    if (periodo?.estaEliminado()) {
      throw new PeriodoEliminadoError(existente.registro.periodoId);
    }
    if (periodo?.estaCerrado()) {
      throw new PeriodoCerradoError(existente.registro.periodoId);
    }

    const fecha = comando.fecha ?? existente.registro.fecha;
    const horaEntrada = comando.horaEntrada ?? existente.registro.horaEntrada;
    const horaSalida = comando.horaSalida ?? existente.registro.horaSalida;
    const comentario =
      comando.comentario !== undefined
        ? comando.comentario
        : existente.registro.comentario;

    const filas = await this.calcularDesglose.calcular(
      existente.registro.empleadoId,
      fecha,
      horaEntrada,
      horaSalida,
    );

    return this.registroHorasRepository.actualizar(
      id,
      { fecha, horaEntrada, horaSalida, comentario },
      filas,
    );
  }
}
