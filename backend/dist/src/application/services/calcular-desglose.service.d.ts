import { FilaCalculo } from '../../domain/services/motor-calculo';
import { ConfiguracionRepository } from '../ports/configuracion.repository.port';
import { FeriadoRepository } from '../ports/feriado.repository.port';
import { SalarioRepository } from '../ports/salario.repository.port';
import { TipoHoraExtraRepository } from '../ports/tipo-hora-extra.repository.port';
export declare class CalcularDesgloseService {
    private readonly salarioRepository;
    private readonly feriadoRepository;
    private readonly configuracionRepository;
    private readonly tipoHoraExtraRepository;
    constructor(salarioRepository: SalarioRepository, feriadoRepository: FeriadoRepository, configuracionRepository: ConfiguracionRepository, tipoHoraExtraRepository: TipoHoraExtraRepository);
    calcular(empleadoId: string, fecha: Date, horaEntrada: string, horaSalida: string): Promise<FilaCalculo[]>;
}
