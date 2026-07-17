import { PeriodoRespuestaDto } from '../periodos/periodo-respuesta.dto';
import { DesgloseTipoHoraDto } from './desglose-tipo-hora.dto';
import { DiaReporteEmpleadoDto } from './dia-reporte-empleado.dto';
import { EmpleadoReporteDto } from './empleado-reporte.dto';
export declare class ReporteEmpleadoRespuestaDto {
    periodo: PeriodoRespuestaDto;
    empleado: EmpleadoReporteDto;
    salarioHora: string;
    dias: DiaReporteEmpleadoDto[];
    horas: DesgloseTipoHoraDto;
    montos: DesgloseTipoHoraDto;
    total: string;
}
