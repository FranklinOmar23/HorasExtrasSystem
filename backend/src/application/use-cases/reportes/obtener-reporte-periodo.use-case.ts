import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import {
  ReportePeriodo,
  ReportePeriodoService,
} from '../../services/reporte-periodo.service';

export class ObtenerReportePeriodoUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly reportePeriodoService: ReportePeriodoService,
  ) {}

  async ejecutar(periodoId: string): Promise<ReportePeriodo> {
    const periodo = await this.periodoRepository.buscarPorId(periodoId);
    if (!periodo) {
      throw new PeriodoNoEncontradoError(periodoId);
    }
    return this.reportePeriodoService.generar(periodo);
  }
}
