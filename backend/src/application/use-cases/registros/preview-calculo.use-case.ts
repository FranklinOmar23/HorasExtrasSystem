import { EmpleadoNoEncontradoError } from '../../../domain/errors/empleado-no-encontrado.error';
import { FilaCalculo } from '../../../domain/services/motor-calculo';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
import { CalcularDesgloseService } from '../../services/calcular-desglose.service';

export interface PreviewCalculoComando {
  empleadoId: string;
  fecha: Date;
  horaEntrada: string;
  horaSalida: string;
}

export class PreviewCalculoUseCase {
  constructor(
    private readonly empleadoRepository: EmpleadoRepository,
    private readonly calcularDesglose: CalcularDesgloseService,
  ) {}

  async ejecutar(comando: PreviewCalculoComando): Promise<FilaCalculo[]> {
    const empleado = await this.empleadoRepository.buscarPorId(
      comando.empleadoId,
    );
    if (!empleado) {
      throw new EmpleadoNoEncontradoError(comando.empleadoId);
    }

    return this.calcularDesglose.calcular(
      comando.empleadoId,
      comando.fecha,
      comando.horaEntrada,
      comando.horaSalida,
    );
  }
}
