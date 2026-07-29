import { EmpleadoNoEncontradoError } from '../../../domain/errors/empleado-no-encontrado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { FilaCalculo } from '../../../domain/services/motor-calculo';
import { fechaFueraDeRango } from '../../../domain/services/rango-fechas.util';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { CalcularDesgloseService } from '../../services/calcular-desglose.service';

export interface PreviewCalculoComando {
  empleadoId: string;
  periodoId: string;
  fecha: Date;
  horaEntrada: string;
  horaSalida: string;
}

export interface ResultadoPreviewCalculo {
  filas: FilaCalculo[];
  esRetroactivo: boolean;
}

export class PreviewCalculoUseCase {
  constructor(
    private readonly empleadoRepository: EmpleadoRepository,
    private readonly periodoRepository: PeriodoRepository,
    private readonly calcularDesglose: CalcularDesgloseService,
  ) {}

  async ejecutar(
    comando: PreviewCalculoComando,
  ): Promise<ResultadoPreviewCalculo> {
    const empleado = await this.empleadoRepository.buscarPorId(
      comando.empleadoId,
    );
    if (!empleado) {
      throw new EmpleadoNoEncontradoError(comando.empleadoId);
    }

    const periodo = await this.periodoRepository.buscarPorId(comando.periodoId);
    if (!periodo) {
      throw new PeriodoNoEncontradoError(comando.periodoId);
    }

    const filas = await this.calcularDesglose.calcular(
      comando.empleadoId,
      comando.fecha,
      comando.horaEntrada,
      comando.horaSalida,
    );

    return {
      filas,
      esRetroactivo: fechaFueraDeRango(
        comando.fecha,
        periodo.fechaInicio,
        periodo.fechaFin,
      ),
    };
  }
}
