import { Periodo } from '../../../domain/entities/periodo.entity';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { ReporteFilaEmpleado, ReportePeriodoService } from '../../services/reporte-periodo.service';
export interface ReporteEmpleadoPeriodo extends ReporteFilaEmpleado {
    periodo: Periodo;
}
export declare class ObtenerReporteEmpleadoUseCase {
    private readonly periodoRepository;
    private readonly empleadoRepository;
    private readonly reportePeriodoService;
    constructor(periodoRepository: PeriodoRepository, empleadoRepository: EmpleadoRepository, reportePeriodoService: ReportePeriodoService);
    ejecutar(periodoId: string, empleadoId: string): Promise<ReporteEmpleadoPeriodo>;
}
