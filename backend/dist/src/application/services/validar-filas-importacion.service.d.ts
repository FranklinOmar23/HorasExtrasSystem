import { Periodo } from '../../domain/entities/periodo.entity';
import { EstadoFilaImportacion } from '../../domain/enums/estado-fila-importacion.enum';
import { FilaExcelCruda } from '../ports/excel-parser.port';
import { EmpleadoRepository } from '../ports/empleado.repository.port';
import { RegistroHorasRepository } from '../ports/registro-horas.repository.port';
import { SalarioRepository } from '../ports/salario.repository.port';
export interface FilaImportacionValidada {
    linea: number;
    fecha: Date | null;
    codigo: number | null;
    nombre: string | null;
    horaEntrada: string | null;
    horaSalida: string | null;
    empleadoId: string | null;
    estado: EstadoFilaImportacion;
    mensajes: string[];
}
export declare class ValidarFilasImportacionService {
    private readonly empleadoRepository;
    private readonly salarioRepository;
    private readonly registroHorasRepository;
    constructor(empleadoRepository: EmpleadoRepository, salarioRepository: SalarioRepository, registroHorasRepository: RegistroHorasRepository);
    validar(filas: FilaExcelCruda[], periodo: Periodo): Promise<FilaImportacionValidada[]>;
    private validarFila;
}
