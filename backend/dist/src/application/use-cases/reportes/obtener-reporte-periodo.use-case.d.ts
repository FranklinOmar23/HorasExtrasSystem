import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { ReportePeriodo, ReportePeriodoService } from '../../services/reporte-periodo.service';
export declare class ObtenerReportePeriodoUseCase {
    private readonly periodoRepository;
    private readonly reportePeriodoService;
    constructor(periodoRepository: PeriodoRepository, reportePeriodoService: ReportePeriodoService);
    ejecutar(periodoId: string): Promise<ReportePeriodo>;
}
