import { CalcularDesgloseService } from '../../services/calcular-desglose.service';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { RegistroConCalculos, RegistroHorasRepository } from '../../ports/registro-horas.repository.port';
export interface ActualizarRegistroComando {
    fecha?: Date;
    horaEntrada?: string;
    horaSalida?: string;
    comentario?: string | null;
}
export declare class ActualizarRegistroUseCase {
    private readonly periodoRepository;
    private readonly registroHorasRepository;
    private readonly calcularDesglose;
    constructor(periodoRepository: PeriodoRepository, registroHorasRepository: RegistroHorasRepository, calcularDesglose: CalcularDesgloseService);
    ejecutar(id: string, comando: ActualizarRegistroComando): Promise<RegistroConCalculos>;
}
