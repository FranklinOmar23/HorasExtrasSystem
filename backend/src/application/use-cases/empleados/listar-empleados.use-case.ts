import { Empleado } from '../../../domain/entities/empleado.entity';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';

export class ListarEmpleadosUseCase {
  constructor(private readonly empleadoRepository: EmpleadoRepository) {}

  async ejecutar(): Promise<Empleado[]> {
    return this.empleadoRepository.listar();
  }
}
