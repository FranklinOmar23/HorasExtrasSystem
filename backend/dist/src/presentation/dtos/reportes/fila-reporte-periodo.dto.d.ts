import { DesgloseTipoHoraDto } from './desglose-tipo-hora.dto';
import { EmpleadoReporteDto } from './empleado-reporte.dto';
export declare class FilaReportePeriodoDto {
    empleado: EmpleadoReporteDto;
    salarioHora: string;
    horas: DesgloseTipoHoraDto;
    montos: DesgloseTipoHoraDto;
    total: string;
}
