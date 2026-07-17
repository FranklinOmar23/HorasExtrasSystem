import { Periodo } from '../../../domain/entities/periodo.entity';
import { EmpleadoNoEncontradoError } from '../../../domain/errors/empleado-no-encontrado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import {
  ReporteFilaEmpleado,
  ReportePeriodoService,
} from '../../services/reporte-periodo.service';

export interface ReporteEmpleadoPeriodo extends ReporteFilaEmpleado {
  periodo: Periodo;
}

export class ObtenerReporteEmpleadoUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly empleadoRepository: EmpleadoRepository,
    private readonly reportePeriodoService: ReportePeriodoService,
  ) {}

  async ejecutar(
    periodoId: string,
    empleadoId: string,
  ): Promise<ReporteEmpleadoPeriodo> {
    const periodo = await this.periodoRepository.buscarPorId(periodoId);
    if (!periodo) {
      throw new PeriodoNoEncontradoError(periodoId);
    }

    const empleado = await this.empleadoRepository.buscarPorId(empleadoId);
    if (!empleado) {
      throw new EmpleadoNoEncontradoError(empleadoId);
    }

    const { fila, registros } =
      await this.reportePeriodoService.generarFilaEmpleado(periodo, empleado);

    return { periodo, fila, registros };
  }
}
