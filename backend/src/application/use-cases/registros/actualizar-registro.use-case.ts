import { PeriodoCerradoError } from '../../../domain/errors/periodo-cerrado.error';
import { PeriodoEliminadoError } from '../../../domain/errors/periodo-eliminado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { RegistroDuplicadoEnOtroPeriodoError } from '../../../domain/errors/registro-duplicado-en-otro-periodo.error';
import { RegistroHorasNoEncontradoError } from '../../../domain/errors/registro-horas-no-encontrado.error';
import { fechaFueraDeRango } from '../../../domain/services/rango-fechas.util';
import { BuscarRegistroDuplicadoService } from '../../services/buscar-registro-duplicado.service';
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
    private readonly buscarRegistroDuplicado: BuscarRegistroDuplicadoService,
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
    if (!periodo) {
      throw new PeriodoNoEncontradoError(existente.registro.periodoId);
    }
    if (periodo.estaEliminado()) {
      throw new PeriodoEliminadoError(existente.registro.periodoId);
    }
    if (periodo.estaCerrado()) {
      throw new PeriodoCerradoError(existente.registro.periodoId);
    }

    const fecha = comando.fecha ?? existente.registro.fecha;
    const horaEntrada = comando.horaEntrada ?? existente.registro.horaEntrada;
    const horaSalida = comando.horaSalida ?? existente.registro.horaSalida;
    const comentario =
      comando.comentario !== undefined
        ? comando.comentario
        : existente.registro.comentario;

    const esRetroactivo = fechaFueraDeRango(
      fecha,
      periodo.fechaInicio,
      periodo.fechaFin,
    );

    if (esRetroactivo) {
      const duplicado = await this.buscarRegistroDuplicado.buscar(
        existente.registro.empleadoId,
        fecha,
        id,
      );
      if (duplicado) {
        throw new RegistroDuplicadoEnOtroPeriodoError(
          existente.registro.empleadoId,
          fecha,
          duplicado.periodoId,
          duplicado.periodoFechaInicio,
          duplicado.periodoFechaFin,
        );
      }
    }

    const filas = await this.calcularDesglose.calcular(
      existente.registro.empleadoId,
      fecha,
      horaEntrada,
      horaSalida,
    );

    return this.registroHorasRepository.actualizar(
      id,
      { fecha, horaEntrada, horaSalida, comentario, esRetroactivo },
      filas,
    );
  }
}
