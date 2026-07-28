import { Periodo } from '../../../domain/entities/periodo.entity';
import { Turno } from '../../../domain/entities/turno.entity';
import { EmpleadoNoEncontradoError } from '../../../domain/errors/empleado-no-encontrado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { RegistroConCalculos } from '../../ports/registro-horas.repository.port';
import { FilaReportePeriodo, ReportePeriodoService } from '../../services/reporte-periodo.service';
import { ResolverTurnoDelEmpleadoUseCase } from '../asignaciones-turno/resolver-turno-del-empleado.use-case';

export interface RegistroConCalculosYTurno extends RegistroConCalculos {
  /** Turno vigente del empleado en la fecha de este registro (asignado o por defecto). */
  turno: Turno;
}

export interface ReporteEmpleadoPeriodo {
  periodo: Periodo;
  fila: FilaReportePeriodo;
  registros: RegistroConCalculosYTurno[];
}

export class ObtenerReporteEmpleadoUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly empleadoRepository: EmpleadoRepository,
    private readonly reportePeriodoService: ReportePeriodoService,
    private readonly resolverTurno: ResolverTurnoDelEmpleadoUseCase,
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

    const registrosConTurno: RegistroConCalculosYTurno[] = await Promise.all(
      registros.map(async (r) => {
        const resolucion = await this.resolverTurno.ejecutar(
          empleadoId,
          r.registro.fecha,
        );
        return { ...r, turno: resolucion.turno };
      }),
    );

    return { periodo, fila, registros: registrosConTurno };
  }
}
