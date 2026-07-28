import { AsignacionTurno } from '../../../domain/entities/asignacion-turno.entity';
import { EmpleadoNoEncontradoError } from '../../../domain/errors/empleado-no-encontrado.error';
import { AsignacionTurnoRepository } from '../../ports/asignacion-turno.repository.port';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';

export class ListarAsignacionesPorEmpleadoUseCase {
  constructor(
    private readonly empleadoRepository: EmpleadoRepository,
    private readonly repository: AsignacionTurnoRepository,
  ) {}

  async ejecutar(empleadoId: string): Promise<AsignacionTurno[]> {
    const empleado = await this.empleadoRepository.buscarPorId(empleadoId);
    if (!empleado) {
      throw new EmpleadoNoEncontradoError(empleadoId);
    }
    return this.repository.listarPorEmpleado(empleadoId);
  }
}
