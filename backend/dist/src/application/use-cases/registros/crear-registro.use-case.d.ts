import { CalcularDesgloseService } from '../../services/calcular-desglose.service';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { RegistroConCalculos, RegistroHorasRepository } from '../../ports/registro-horas.repository.port';
export interface CrearRegistroComando {
    periodoId: string;
    empleadoId: string;
    fecha: Date;
    horaEntrada: string;
    horaSalida: string;
    comentario: string | null;
}
export declare class CrearRegistroUseCase {
    private readonly periodoRepository;
    private readonly empleadoRepository;
    private readonly registroHorasRepository;
    private readonly calcularDesglose;
    constructor(periodoRepository: PeriodoRepository, empleadoRepository: EmpleadoRepository, registroHorasRepository: RegistroHorasRepository, calcularDesglose: CalcularDesgloseService);
    ejecutar(comando: CrearRegistroComando): Promise<RegistroConCalculos>;
}
