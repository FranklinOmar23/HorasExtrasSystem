import Decimal from 'decimal.js';
import { Empleado } from '../../domain/entities/empleado.entity';
import { Periodo } from '../../domain/entities/periodo.entity';
import { ConfiguracionRepository } from '../ports/configuracion.repository.port';
import { EmpleadoRepository } from '../ports/empleado.repository.port';
import { RegistroConCalculos, RegistroHorasRepository } from '../ports/registro-horas.repository.port';
import { SalarioRepository } from '../ports/salario.repository.port';
export interface DesgloseTipoHora {
    he35: Decimal;
    he100: Decimal;
    nocturna: Decimal;
    feriado: Decimal;
}
export interface FilaReportePeriodo {
    empleado: {
        id: string;
        codigo: number;
        nombre: string;
    };
    salarioHora: Decimal;
    horas: DesgloseTipoHora;
    montos: DesgloseTipoHora;
    total: Decimal;
}
export interface ReportePeriodo {
    periodo: Periodo;
    filas: FilaReportePeriodo[];
    granTotal: Decimal;
}
export interface ReporteFilaEmpleado {
    fila: FilaReportePeriodo;
    registros: RegistroConCalculos[];
}
export declare class ReportePeriodoService {
    private readonly registroHorasRepository;
    private readonly empleadoRepository;
    private readonly salarioRepository;
    private readonly configuracionRepository;
    constructor(registroHorasRepository: RegistroHorasRepository, empleadoRepository: EmpleadoRepository, salarioRepository: SalarioRepository, configuracionRepository: ConfiguracionRepository);
    generar(periodo: Periodo): Promise<ReportePeriodo>;
    generarFilaEmpleado(periodo: Periodo, empleado: Empleado): Promise<ReporteFilaEmpleado>;
    private obtenerDivisorSalario;
    private agregarFilaEmpleado;
}
