import { Empleado } from '../../../domain/entities/empleado.entity';
import { EmpleadoNoEncontradoError } from '../../../domain/errors/empleado-no-encontrado.error';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';

export class ObtenerEmpleadoUseCase {
  constructor(private readonly empleadoRepository: EmpleadoRepository) {}

  async ejecutar(id: string): Promise<Empleado> {
    const empleado = await this.empleadoRepository.buscarPorId(id);
    if (!empleado) {
      throw new EmpleadoNoEncontradoError(id);
    }
    return empleado;
  }
}
