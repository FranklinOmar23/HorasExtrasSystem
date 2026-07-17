import Decimal from 'decimal.js';
import { Periodo } from '../../../domain/entities/periodo.entity';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { ReportePeriodoService } from '../../services/reporte-periodo.service';
export interface HistoricoPeriodo {
    periodo: Periodo;
    granTotal: Decimal;
}
export declare class ObtenerReporteHistoricoUseCase {
    private readonly periodoRepository;
    private readonly reportePeriodoService;
    constructor(periodoRepository: PeriodoRepository, reportePeriodoService: ReportePeriodoService);
    ejecutar(meses: number): Promise<HistoricoPeriodo[]>;
}
