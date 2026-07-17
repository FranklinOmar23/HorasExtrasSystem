import Decimal from 'decimal.js';
import { Periodo } from '../../../domain/entities/periodo.entity';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { ReportePeriodoService } from '../../services/reporte-periodo.service';

export interface HistoricoPeriodo {
  periodo: Periodo;
  granTotal: Decimal;
}

function fechaCorteHaceMeses(meses: number): Date {
  const ahora = new Date();
  return new Date(
    Date.UTC(
      ahora.getUTCFullYear(),
      ahora.getUTCMonth() - meses,
      ahora.getUTCDate(),
    ),
  );
}

export class ObtenerReporteHistoricoUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly reportePeriodoService: ReportePeriodoService,
  ) {}

  async ejecutar(meses: number): Promise<HistoricoPeriodo[]> {
    const todos = await this.periodoRepository.listar();
    const fechaCorte = fechaCorteHaceMeses(meses);

    const periodosEnRango = todos
      .filter((periodo) => periodo.fechaInicio >= fechaCorte)
      .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());

    const resultado: HistoricoPeriodo[] = [];
    for (const periodo of periodosEnRango) {
      const reporte = await this.reportePeriodoService.generar(periodo);
      resultado.push({ periodo, granTotal: reporte.granTotal });
    }
    return resultado;
  }
}
