import { FilaCalculo } from '../../../domain/services/motor-calculo';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
import { CalcularDesgloseService } from '../../services/calcular-desglose.service';
export interface PreviewCalculoComando {
    empleadoId: string;
    fecha: Date;
    horaEntrada: string;
    horaSalida: string;
}
export declare class PreviewCalculoUseCase {
    private readonly empleadoRepository;
    private readonly calcularDesglose;
    constructor(empleadoRepository: EmpleadoRepository, calcularDesglose: CalcularDesgloseService);
    ejecutar(comando: PreviewCalculoComando): Promise<FilaCalculo[]>;
}
